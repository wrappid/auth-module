import {
  ApplicationContext,
  communicate,
  coreConstant,
  databaseActions,
  databaseProvider,
  WrappidLogger,
} from "@wrappid/service-core";
// eslint-disable-next-line import/no-unresolved
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeviceDetector from "node-device-detector";
import otpGenerator from "otp-generator";
import constant from "../constants/constants";



import {
  clearValidatePhoneEmail,
  getDeviceId,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
} from "./auth.helper.functions";

/**
 * 
 * @param req 
 * @returns 
 */
const checkLoginOrRegisterUtil = async (req: any) => {
  try {
    WrappidLogger.logFunctionStart("checkLoginOrRegisterUtil");
    // let iWsValidJOI = await authenticateJOI(req,"checkLoginOrRegisterPOST",["body","query"])
    const emailOrPhone = req.body.emailOrPhone;
    const ob: any = clearValidatePhoneEmail(emailOrPhone);
    let whereOb = {};
    if (ob.type === COMMUNICATION_EMAIL) whereOb = { email: emailOrPhone };
    else if (ob.type === COMMUNICATION_SMS) whereOb = { phone: emailOrPhone };
    else {
      WrappidLogger.info("Not a valid email or phone");
      return { staus: 500, message: "Not a valid email or phone" };
    }
    const data = await databaseActions.findOne("application", "Users", {
      where: whereOb,
    });

    if (data) {
      if (data.firstLogin) {
        WrappidLogger.info("User found, first time login " + data.id);
        return { status: 201, message: "First login for created user" };
      } else {
        WrappidLogger.info("User found " + data.id);
        const personData = await databaseActions.findOne(
          "application",
          "Persons",
          {
            where: {
              userId: data.id,
            }
          }
        );

        return {
          status: 200,
          message: "User Found",
          data: {
            name: personData?.firstName +
              " " + personData?.middleName +
              " " + personData?.lastName,
            photoUrl: personData?.photoUrl,
            isVerified: personData?.isVerified,
          }
        };
      }
    } else {
      if (ob.valid) {
        const userBody = whereOb;
        const result = await databaseProvider.application.sequelize.transaction(
          async (t: any) => {
            //Changed
            const rolesData = await databaseActions.findOne(
              "application",
              "Roles",{
                where: { role: ApplicationContext.getContext("config").wrappid.defaultUserRole || constant.userRoles.ROLE_DEVELOPER },
              });
            const userData = await databaseActions.create(
              "application",
              "Users",{
                ...userBody,
                roleId: rolesData.id,
                firstLogin: true,
              },
              { transaction: t }
            );
            WrappidLogger.info("User Created " + userData.id);

            const personData = await databaseActions.create(
              "application",
              "Persons",{
                ...userBody,
                profileId: Date.now(),
                userId: userData.id,
                /**
                 * @todo
                 * added for phase 0.5
                 */
                isVerified: true,
              },
              { transaction: t }
            );
            WrappidLogger.info("Person Created " + personData.id);

            const person = await databaseActions.create(
              "application",
              "PersonContacts",{
                data: emailOrPhone,
                type:
                  ob.type === coreConstant.commType.EMAIL
                    ? coreConstant.contact.EMAIL
                    : coreConstant.contact.PHONE,
                personId: personData.id,
                _status: coreConstant.entityStatus.ACTIVE,
              },
              { transaction: t }
            );
            WrappidLogger.info("Person contact Created " + person.id);
            return { status: 201, message: "New User created" };
          }
        );
        WrappidLogger.info("New User created");
        return result;
      } else {
        console.error("Not a valid mail or phone:", emailOrPhone);
        return { status: 405, message: "Not valid phone or email" };
      }
    }
  } catch (err: any) {
    WrappidLogger.info("Error in check register " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("checkLoginOrRegisterUtil");
  }
};

/**
 * 
 * @param req 
 * @param otherLogin 
 * @returns 
 */
const loginHelper = async (req: any, otherLogin: any) => {
  try {
    WrappidLogger.logFunctionStart("loginHelper");
    let otpLogin = false;
    let urlLogin = false;
    const emailOrPhone = req.body.emailOrPhone;
    const ob: any = clearValidatePhoneEmail(req.body.emailOrPhone);
    let whereOb = {};
    let resetPassword = false;
    let updatePassword = false;
    let verificationOb: any = {};

    if (otherLogin?.otpLogin) {
      otpLogin = true;
    } else if (otherLogin?.urlLogin) {
      urlLogin = true;
    }
    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
      verificationOb = { emailVerified: true };
    } else if (ob.type == COMMUNICATION_SMS) {
      verificationOb = { phoneVerified: true };

      whereOb = { phone: emailOrPhone };
    } else {
      WrappidLogger.info("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    //check if it is a reset password request
    if (req.query.reset) {
      WrappidLogger.info("Login with password reset mode");
      if (req.query.reset === "true") {
        resetPassword = true;
      } else {
        WrappidLogger.info("*********************************");
        WrappidLogger.info("RESET NOT IN CORRECT FORMAT");
        WrappidLogger.info("*********************************");
        return { status: 401, message: "Reset not in correct format" };
      }
    }

    const userDetails = await databaseActions.findOne("application", "Users", {
      where: whereOb,
    });

    if (!userDetails) {
      WrappidLogger.info("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (!userDetails.isActive) {
      WrappidLogger.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      const userId = userDetails.id;
      const mail = userDetails.email;
      const phone = userDetails.phone;
      const userUpdateOb: any = {};

      const personData = await databaseActions.findOne("application", "Persons", {
        attributes: ["id", "userInvitationToken"],
        where: { userId: userId },
      });
      const personId = personData.id;
      WrappidLogger.info("Person details fetched");

      if (otpLogin) {
        const otpCheck = await checkOtp(userId, req.body.otp, ob.type);
        if (!otpCheck) {
          WrappidLogger.info("OTP match fail");
          return { status: 500, message: "OTP does not match" };
        } else {
          WrappidLogger.info("OTP match passed");
          await databaseActions.update(
            "application",
            "Otps",
            { _status: coreConstant.entityStatus.INACTIVE },
            { where: {
              userId: userId,
              otp: req.body.otp,
            }});

          if (resetPassword) {
            const passwordValid = resetPasswordCheck(
              req.body.password,
              userDetails
            );

            if (passwordValid?.success) {
              updatePassword = true;
              userUpdateOb["password"] = passwordValid.password;
            } else {
              return {
                status: 500,
                message: passwordValid.message,
              };
            }
          }
        }
      } else if (urlLogin) {
        const check = checkUrlLoginValidation(req, personData);
        if (check) {
          WrappidLogger.info("Validation done");
        } else {
          WrappidLogger.info("Validation failed");
          return { status: 401, message: "Invalid url token" };
        }
      } else if (!checkPassword(req.body.password, userDetails.password)) {
        console.error("Invalid password");
        return { status: 401, message: "Invalid password" };
      }

      const deviceId = await getDeviceId(req);
      WrappidLogger.info("Device id fetched");

      const { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );
      WrappidLogger.info("Tokens generate done");

      const sessions = await databaseActions.findAll(
        "application",
        "SessionManagers",
        {
          where: {
            userId: userId,
          },
        }
      );

      WrappidLogger.info("All sessions fetchd: " + sessions.length);
      let found = false;

      const result = await databaseProvider.application.sequelize.transaction(
        async (t: any) => {
          //check first time login
          if (userDetails.firstLogin) {
            WrappidLogger.info("First time login detected");
            userUpdateOb["firstLogin"] = false;
          }

          if (userDetails.firstLogin || updatePassword) {
            const [checkUser] = await databaseActions.update(
              "application",
              "Users",
              {   ...userUpdateOb },
              {
                where: {
                  id: userId,
                },
              },{ transaction: t }
            );
            if (checkUser == 0) {
              WrappidLogger.error("DB update error");
              throw "DB update error";
            } else {
              WrappidLogger.info("First time login updated");
            }
          }

          //for otplogin update personContact verfication status
          if (otpLogin || urlLogin) {
            WrappidLogger.info("PersonContacts updating due to otplogin or urllogin");
            const [checkContacts] = await databaseActions.update(
              "application",
              "PersonContacts",
              { verified: true },
              {
                where: {
                  personId: personId,
                  data: emailOrPhone,
                },
                transaction: t,
              }
            );

            if (checkContacts == 0) {
              WrappidLogger.error("Person contact update not made, user id:" + userId+ " contact: " + emailOrPhone );
              throw "DB update error";
            } else {
              WrappidLogger.info("PersonContacts updated");
            }
          }

          //user emailphone verified status change
          if (
            userDetails.firstLogin ||
            (verificationOb.emailVerified && !personData.emailVerified) ||
            (verificationOb.phoneVerified && !personData.phoneVerified)) {
            WrappidLogger.info("Persons table updating: " + verificationOb);
            if (urlLogin) {
              verificationOb["userInvitationToken"] = null;
            }

            const [checkPerson] = await databaseActions.update(
              "application",
              "Persons",
              verificationOb,
              {
                where: {
                  userId: userId,
                },
                transaction: t,
              }
            );
            if (checkPerson == 0) {
              WrappidLogger.error("DB update error");
              throw "DB update error";
            } else {
              WrappidLogger.info("Persons table updated");
            }
          }

          for (let session = 0; session < sessions.length; session++) {
            const currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              WrappidLogger.info("*****************************");
              WrappidLogger.info("session found " + currSession.id);
              WrappidLogger.info("*****************************");
              found = true;

              const [nrows] = await databaseActions.update(
                "application",
                "SessionManagers",
                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: t,
                }
              );

              if (nrows > 0) {
                WrappidLogger.info("Login Success");
                // get person id
                const person = await databaseActions.findOne(
                  "application",
                  "Persons",
                  {
                    where: {
                      userId: userId,
                    },
                  }
                );
                createLoginLogs(req.originalUrl, userId, req.body?.devInfo);
                return {
                  status: 200,
                  message: "Successfully login",
                  id: userId,
                  personId: person.id,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  sessionId: currSession.id,
                };
              } else {
                WrappidLogger.error("Can not save refresh token " + nrows);
                return { status: 500, message: "Database error" };
              }
            }
          }

          if (!found) {
            const newSession = await databaseActions.create(
              "application",
              "SessionManagers",
              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: t,
              }
            );
            WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);
            createLoginLogs(req.originalUrl, userId, req.body?.devInfo);

            // get person id
            const person = await databaseActions.findOne(
              "application",
              "Persons",
              {
                where: {
                  userId: userId,
                },
              }
            );

            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: person.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );

      return result;
    }
  } catch (err: any) {
    WrappidLogger.info("Error in login: " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("loginHelper");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
const logoutHelper = async (req: any) => {
  try {
    WrappidLogger.logFunctionStart("logoutHelper");
    console.error("user:: ", req.user);
    const deviceId = await getDeviceId(req);
    const sessions = await databaseActions.findAll(
      "application",
      "SessionManagers",
      {
        where: {
          userId: req.user.userId,
        },
      }
    );
    for (let session = 0; session < sessions.length; session++) {
      const currSession = sessions[session];
      if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
        const [nrows] = await databaseActions.update(
          "application",
          "SessionManagers",
          { refreshToken: "" },
          {
            where: {
              id: currSession.id,
            },
          }
        );
        if (nrows > 0) {
          WrappidLogger.info("Successfully logged out");
          return { status:200, message: "Successfully logged out" };
        } else {
          console.error("Database error in logout");
          return { status:500,  message: "Database error" };
        }
        break;
      }
    }
    return { staus:204, message: "No session found!!" };
  } catch (err: any) {
    WrappidLogger.error("Database error in logout" + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("logoutHelper");
  }
};

/**
 * 
 * @param userId 
 * @param otp 
 * @returns 
 */
async function checkOtp(userId: any, otp: any, type: string) {
  WrappidLogger.logFunctionStart("checkOtp");
  try {
    const dbData = await databaseActions.findAll("application", "Otps", {
      where: {
        userId: userId,
        type: type,
        _status: coreConstant.entityStatus.ACTIVE,
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
function resetPasswordCheck(password: any, userDetails: any) {
  try {
    WrappidLogger.logFunctionStart("resetPasswordCheck");
    const samePasswordCheck = checkPassword(password, userDetails.password);

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

/**
 * 
 * @param req 
 * @param personData 
 * @returns 
 */
function checkUrlLoginValidation(req: any, personData: any) {
  WrappidLogger.info("DB TOKEN: " + personData + " req token: " + req.body.userInvitationToken );
  if (personData.userInvitationToken === req.body.userInvitationToken) {
    WrappidLogger.info("Url login token vvalidation succssfull");
    return true;
  } else {
    WrappidLogger.info("Url login token vvalidation failed");
    return false;
  }
}

/**
 * 
 * @param reqPassword 
 * @param dbPassword 
 * @returns 
 */
function checkPassword(reqPassword: any, dbPassword: any) {
  return bcrypt.compareSync(reqPassword, dbPassword);
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
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const getIPHelper = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("getIPHelper");
    WrappidLogger.info(res);
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: true,
    });
    detector.detect(req.headers["user-agent"]);
    const devId = await getDeviceId(req);
    req.devId = devId;
    return { status: 200, devId: devId };
  } catch (err: any) {
    WrappidLogger.error("internal error" + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("getIPHelper");
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
const refreshTokenHelper = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("refreshTokenHelper");
    const {
      accessTokenSecret,
      refreshAccessTokenSecret,
      expTime,
    } = ApplicationContext.getContext("config").jwt;

    return jwt.verify(
      req.body.refreshToken,
      refreshAccessTokenSecret,
      async (err: any, user: any) => {
        if (err) {
          WrappidLogger.error("Refresh token expired " + err);
          return { status: 401, message: "Refresh token expired" };
        }
        const userId = user.userId;
        // let isValidJOI = await authenticateJOI(req,"refreshtokenPOST",["body"])
        // if(isValidJOI.validFlag){
        // const deviceId = '::1';
        const deviceId = await getDeviceId(req);
        const sessions = await databaseActions.findAll(
          "application",
          "SessionManagers",
          {
            where: {
              userId: userId,
              // deviceId: deviceId
            },
          }
        );
        WrappidLogger.info("Sessions available:" + sessions.length);
        for (let session = 0; session < sessions.length; session++) {
          const currSession = sessions[session];
          if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
            const token = req.body.refreshToken;
            const refreshToken = currSession.refreshToken;
            WrappidLogger.info("Session:" + currSession.id);
            if (!token) {
              return { status: 401, message: "Invalid request" };
            }
            if (refreshToken != token) {
              WrappidLogger.error("Wrong refresh token");
              return { status: 401, message: "unauthorised access" };
            }
            const userDetails = await databaseActions.findOne(
              "application",
              "Users",
              {
                where: {
                  id: userId,
                }
              }
            );
            const accessToken = jwt.sign(
              {
                userId: userDetails.id,
                email: userDetails.email,
                phone: userDetails.phone,
                roleId: userDetails.roleId,
              },
              accessTokenSecret,
              { expiresIn: expTime }
            );
            WrappidLogger.info("Access token refreshed");
            return {
              status: 200,
              accessToken: accessToken,
            };
          }
        }
        WrappidLogger.info("session not found");
        return {
          status: 401,
          message: "session not found",
        };
      }
    );
  } catch (err: any) {
    WrappidLogger.error("Database error in refresh token: " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("refreshTokenHelper");
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const clientLoginInformationHelper = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("clientLoginInformationHelper");
    WrappidLogger.info(res);
    const userID = req.user.userId;

    // ip
    const ip = req?.socket?.remoteAddress || req?.ip || "Not found";

    // last login info
    const lastLoginDetails = await databaseActions.findOne(
      "application",
      "LoginLogs",
      {
        where: { userId: userID },
        order: [["createdAt", "DESC"]],
      }
    );

    // device info
    const deviceInfo = await databaseActions.findOne(
      "application",
      "SessionManagers",
      {
        where: { userId: userID },
        order: [["createdAt", "DESC"]],
      }
    );
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);
    WrappidLogger.info("result parse" + result);
    return {
      status: 200,
      deviceInfo: deviceInfo,
      ip: ip,
      lastLoginDetails: lastLoginDetails,
      result: result,
      userAgent: userAgent,
    };
  } catch (err: any) {
    WrappidLogger.info("Error : " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("clientLoginInformationHelper");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const sentOtp = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("sentOtp");
    WrappidLogger.info(res);
    const commData: any = {};
    let userId = req?.user?.userId;
    const emailOrPhone = req.body.data;
    let commType = req.body?.type;
    if (!commType) {
      const { type }: any = clearValidatePhoneEmail(emailOrPhone);
      commType = type;
    }
    let templateID = req.body?.templateID;
    const serviceName = req.body?.service;


    /**
     * @todo need to add template kit19
     */
    // if(commType === constant.communication.SMS){
    //   switch (serviceName) {
    //     case "loginWithOtp":
    //       templateID = constant.communication.SENT_OTP_LOGIN_WITH_OTP_SMS_EN;
    //       break;
    //     case "reset":
    //       templateID = constant.communication.SENT_OTP_RESET_PASSWORD_OTP_SMS_EN;
    //       break;
    //     case "forgotpwd":
    //       templateID = constant.communication.SENT_OTP_LOGIN_WITH_OTP_SMS_EN;
    //       break;  
    //     default:
    //       break;
    //   }
    // }

    if (commType === constant.communication.EMAIL) {
      switch (serviceName) {
        case "loginWithOtp":
          templateID = constant.communication.SENT_OTP_LOGIN_WITH_OTP_MAIL_EN;
          break;
        case "loginWithResetPassword":
          templateID = constant.communication.SENT_OTP_RESET_PASSWORD_MAIL_EN;
          break;
        default:
          break;
      }
    }


    if (!userId) {
      const user = await databaseActions.findOne("application", "Users", {
        where:
          commType === COMMUNICATION_EMAIL
            ? {
              email: req.body.data,
            }
            : {
              phone: req.body.data,
            },
      });
      userId = user?.id;
      commData.id = user?.id;
    }
    /**
 * suggested by @pritamIT2024
 */
    if (!userId) {
      const person = await databaseActions.findOne("application", "PersonContacts", {
        where:{
          data: req.body.data,
          isActive: true,
          _status : constant.entityStatus.ACTIVE
        }
      });
      const user = await databaseActions.findOne("application", "Persons", {
        where: {
          id: person?.personId,

        }
      }); 
      userId = user?.userId;
      commData.id = user?.userId;
    }

    const contactType =
      commType === coreConstant.commType.SMS
        ? coreConstant.contact.PHONE
        : commType;
    const personContact = await databaseActions.findOne(
      "application",
      "PersonContacts",{
        where: { data: emailOrPhone, type: contactType },
      }
    );
    if (personContact == null) {
      WrappidLogger.error("Email or phone not exist");
      throw new Error("Email or phone not exist");
    }

    if (!templateID) {
      templateID =
        commType === coreConstant.commType.EMAIL
          ? coreConstant.communication.SENT_OTP_MAIL_EN
          : coreConstant.communication.SENT_OTP_SMS_EN;
    }

    let genetatedOTP = otpGenerator.generate(
      ApplicationContext.getContext("config").wrappid.otpLength,
      {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      }
    );
    if (req.query.test === true) {
      genetatedOTP = "000000";
    }

    if (genetatedOTP) {
      commData.otp = genetatedOTP;
    }

    const commResult = await communicate({
      commType,
      commRecipients: {
        to: [emailOrPhone],
      },
      commData,
      commTemplateID: templateID,
      directFlag: true,
      errorFlag: true,
    });

    if (commResult) {
      await databaseActions.update(
        "application",
        "Otps",
        { _status: coreConstant.entityStatus.INACTIVE },
        {
          where: {
            type: commType,
            userId: userId,
          },
        }
      );

      await databaseActions.create("application", "Otps", {
        otp: genetatedOTP,
        type: commType,
        _status: coreConstant.entityStatus.ACTIVE,
        userId: userId,
      });

      WrappidLogger.info(`OTP ${commType} sent successfully.`);
      return { status: 200, message: `OTP ${commType} sent successfully.` };
    } else {
      throw new Error(`OTP ${commType} sent failed.`);
    }
  } catch (err: any) {
    WrappidLogger.error("Error: " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("sentOtp");
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const postChangePasswordFunc = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("postChangePasswordFunc");
    WrappidLogger.info("res:" + res);
    const { password, newPassword, confirmPassword } = req.body;

    const user = await databaseActions.findOne("application", "Users", {
      where: {
        id: req.user.userId,
      },
    });
    const oldPassExist = checkPassword(password, user.password);

    if (password === newPassword) {
      WrappidLogger.error("Password can't be same.");
      throw new Error("Password can't be same.");
    }

    if (oldPassExist && newPassword === confirmPassword) {
      const result = await databaseActions.update(
        "application",
        "Users",
        { password: bcrypt.hashSync(newPassword, 9) },
        {
          where: {
            id: req.user.userId,
          }
        }
      );

      if (result) {
        return { status: 200, message: "Password changed successfully." };
      } else {
        WrappidLogger.error("Something went wrong.");
        throw new Error("Something went wrong.");
      }
    } else {
      WrappidLogger.error("Old password is wrong.");
      throw new Error("Old password is wrong.");
    }
  } catch (err: any) {
    WrappidLogger.error("Error: " + err);
    return { status: 500, message: err?.message || "Something went wrong." };
  }finally{
    WrappidLogger.logFunctionEnd("postChangePasswordFunc");
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const postVerifyOtpFunc = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("postVerifyOtpFunc");
    WrappidLogger.info("res: " + res);
    const userId = req.user.userId;

    const person = await databaseActions.findOne("application", "Persons", {
      where: {
        userId: userId,
      },
    });
    const personId = person.id;

    const otpInDb = await databaseActions.findOne("application", "Otps", {
      where: {
        userId: userId,
        isActive: true,
      },
      order: [["id", "desc"]],
    });

    // WrappidLogger.info("OTP in db" + otpInDb.otp);
    // WrappidLogger.info("OTP by user" + req.body.otp);

    if (req.body.otp == otpInDb.otp) {
      WrappidLogger.info("OTP matched");
      const [nrows] = await databaseActions.update(
        "application",
        "PersonContacts",
        { verified: true },
        {
          where: {
            personId: personId,
            data: req.body.data,
          },
        }
      );
      if (nrows > 0) {
        WrappidLogger.info("Person contact updated.");
        WrappidLogger.info("OTP verified");
        return { status: 200, message: "OTP verified" };
      } else {
        WrappidLogger.info("Person contact not updated");
        return { status: 500, message: "Internal error" };
      }
    } else {
      // WrappidLogger.info("OTP mismatch, dbOtp: " + otpInDb.otp + " user given otp: " + req.body.otp );
      return { status: 500, message: "OTP mismatch" };
    }
  } catch (err: any) {
    WrappidLogger.info("Error: " + err);
    return { status: 500, message: "Error to fetch Contacts data" };
  }finally{
    WrappidLogger.logFunctionEnd("postVerifyOtpFunc");
  }
};

export {
  checkLoginOrRegisterUtil,
  loginHelper,
  logoutHelper,
  getIPHelper,
  refreshTokenHelper,
  clientLoginInformationHelper,
  sentOtp,
  postChangePasswordFunc,
  postVerifyOtpFunc,
};
