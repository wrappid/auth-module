import {
  ApplicationContext,
  coreConstant,
  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeviceDetector from "node-device-detector";
import constant from "../constants/constants";

const COMMUNICATION_EMAIL = coreConstant.commType.EMAIL;
const COMMUNICATION_SMS = coreConstant.commType.SMS;
const COMMUNICATION_WHATSAPP = coreConstant.commType.WHATSAPP;
const COMMUNICATION_PUSH_NOTIFICATION = coreConstant.commType.NOTIFICATION;

/**
 * 
 * @param text 
 * @returns 
 */
function clearValidatePhoneEmail(text: any) {
  try {
    WrappidLogger.logFunctionStart("clearValidatePhoneEmail");
    let t = text;
    if (t[0] == "'") {
      t = t.slice(1);
      t = t.toLowerCase();
    }
    let f = String(t).match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (f) {
      return { valid: f, type: COMMUNICATION_EMAIL };
    } else if (!f) {
      f = String(t).match(
        /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
      );
      if (f) {
        return { valid: f, type: COMMUNICATION_SMS };
      } else {
        return { valid: f, type: "" };
      }
    }

    return [f, t];
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("clearValidatePhoneEmail");
  }
  
}

/**
 * 
 * @param req 
 * @returns 
 */
async function getDeviceId(req: any) {
  try {
    WrappidLogger.logFunctionStart("getDeviceId");
    // WrappidLogger.info("mac_ip" + mac_ip)
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: true,
    });
    const result = detector.detect(req.headers["user-agent"]);
    WrappidLogger.info("Result:: " + result);
    const ip = await getIP(req);
    // WrappidLogger.info('ip:: ', ip)
    let con = result.device.id + ip;
    con = con.trim();
    // hashedId =  await bcrypt.hashSync(con, 10)
    return con;
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getDeviceId");
  }
}

/**
 * 
 * @param req 
 * @returns 
 */
async function getIP(req: any) {
  try {
    let ip;
    WrappidLogger.logFunctionStart("getIP");
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else if (req.socket && req.socket.remoteAddress) {
      ip = req.socket.remoteAddress;
    } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else {
      ip = req.ip;
    }
    return ip;
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getIP");
  }
}





/**
 * 
 * @param userId 
 * @param mail 
 * @param phone 
 * @param personData 
 * @param userDetails 
 * @returns 
 */
function genarateAccessToken(
  userId: any,
  mail: any,
  phone: any,
  personData: any,
  userDetails: any
) {
  try {
    WrappidLogger.logFunctionStart("genarateAccessToken");

    const {
      accessTokenSecret,
      refreshAccessTokenSecret,
      expTime,
      expTimeRefreshToken,
    } = ApplicationContext.getContext("config").jwt;

    const accessToken = jwt.sign(
      {
        userId: userId,
        email: mail,
        phone: phone,
        personId: personData?.id,
        roleId: userDetails.roleId,
      },
      accessTokenSecret,
      { expiresIn: expTime }
    );
    const refreshToken = jwt.sign(
      {
        userId: userId,
        email: mail,
        phone: phone,
        personId: personData?.id,
        roleId: userDetails.roleId,
      },
      refreshAccessTokenSecret,
      { expiresIn: expTimeRefreshToken }
    );
    WrappidLogger.info("Tokens generated");
    return { accessToken, refreshToken };
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("genarateAccessToken");
  }
}

/**
 * 
 * @param path 
 * @param userId 
 * @param extraInfo 
 */
async function createLoginLogs(path: any, userId: any, extraInfo: any = "{}") {
  try {
    WrappidLogger.logFunctionStart("createLoginLogs");
    WrappidLogger.info("Login logs created" + userId + path);
    await databaseActions.create("application", "LoginLogs", {
      userId: userId,
      route: path,
      message: "Login Success",
      status: 200,
      extraInfo: JSON.parse(extraInfo),
    });
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("createLoginLogs");
  }
 
}



/**
 *  Check Password
 * @param reqPassword 
 * @param dbPassword 
 * @returns 
 */
function checkPassword(reqPassword: string, dbPassword: string) {
  const isMatch =  bcrypt.compareSync(reqPassword, dbPassword);
  return isMatch;
}


/**
 * Check DB otp with req OTP
 * @param userId 
 * @param otp 
 * @returns 
 */
async function checkOtp(userId: number, otp: string, type: string) {
  WrappidLogger.logFunctionStart("checkOtp");
  try {
    const dbData = await databaseActions.findAll("application", "Otps", {
      where: {
        userId: userId,
        type: type,
        _status: constant.entityStatus.ACTIVE,
      },
      limit: 1,
      order: [["id", "DESC"]]
    }
    );
    const dbOtp = dbData[0].dataValues.otp;
    if (Number(dbOtp ) === Number(otp)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("checkOtp");
  }

}



/**
 * 
 * @param password 
 * @param userDetails 
 * @returns 
 */
function resetPasswordCheck(password: string, userDetailsPassword: string) {
  try {
    WrappidLogger.logFunctionStart("resetPasswordCheck");
    const samePasswordCheck = checkPassword(password, userDetailsPassword);

    if (samePasswordCheck) {
      WrappidLogger.info("Password can not be same as previous password");
      return {
        success: false,
        message: "Password can not be same as previous password",
      };
    } else
      return {
        success: true,
        password: bcrypt.hashSync(password, 9),
        message: "Password reset can be done",
      };
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("resetPasswordCheck");
  }
  
}
export {
  clearValidatePhoneEmail,
  getDeviceId,
  getIP,
  genarateAccessToken,
  createLoginLogs,
  checkPassword,
  checkOtp,
  resetPasswordCheck,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
  COMMUNICATION_WHATSAPP,
  COMMUNICATION_PUSH_NOTIFICATION,
};
