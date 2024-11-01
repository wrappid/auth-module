import {
  ApplicationContext,
  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IApiResponse, LogoutResponse, RefreshToken, Register } from "../types/auth.types";
import { checkOtp, createSessionAndLogin, getIdentifierType } from "./auth.helper.functions";
import { checkUserExistance, createUser } from "./user.function";


/**
 * This function is used to check if the user exists in the database
 * 1. Get identifier type
 * 2. user existence check based on type and identifier
 * 3. If exist then get user information 
 * 4. If not exist then create user
 * 5. Return user info
 * @param identifier  email or phone number of the user
 * @returns
 */
const checkUserFunc = async (identifier: string): Promise<IApiResponse> => {
  try {
    WrappidLogger.logFunctionStart("checkUser");
    let returnData: IApiResponse;
    const identifierType: string = await getIdentifierType(identifier);
    const data = await checkUserExistance(identifierType, identifier);
    if (data) {
      const personData = await databaseActions.findOne("application", "Persons", { where: { userId: data.id } });
      returnData = {
        status: 200,
        resData: {
          message: "User already exists",
          data: {
            name: personData.firstName,
            photoUrl: personData.photoUrl
          }
        }
      };
    } else {
      returnData = await createUser(identifierType, identifier);
    }

    WrappidLogger.info("returnData" + returnData);
    return returnData;
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("checkUser");
  }
};


/**
 * This function is used to register user with password
 * @param identifier 
 * @param password 
 * @param confirmPassword 
 * @param otp 
 */
const registerWithPasswordFunc = async (identifier: string, password: string, confirmPassword: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    let returnData = {} as Register;
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const identifierType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(identifierType, identifier);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(userData.id, otp, identifierType);

    if (!otpCheck) {
      throw new Error("Invalid otp");
    } else {
      const hashedPassword = await bcrypt.hash(password, 9); // Hash the password
      await databaseActions.update("application", "Users", { password: hashedPassword }, { where: { id: userData.id } }); // Update the password
      const data = await createSessionAndLogin(userData, originalUrl, deviceId, devInfo);
      await databaseActions.create("application", "UserRoles", { userId: userData.id, roleId: 1 }); 
      returnData = {
        status: 200,
        resData: data
      };
    }
    return returnData;
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  }
};


/**
 * This function is used to login with password
 * @param identifier 
 * @param password 
 * @param originalUrl 
 * @param deviceId 
 * @param devInfo 
 * @returns 
 */
const loginWithPasswordFunc = async (identifier: string, password: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    let returnData = {} as Register;
    const identifierType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(identifierType, identifier);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const dbPassword = userData.password;
    const checkPass = bcrypt.compareSync(password, dbPassword);
    if (!checkPass) {
      throw new Error("Invalid password");
    }
    const data = await createSessionAndLogin(userData, originalUrl, deviceId, devInfo);
    returnData = {
      status: 200,
      resData: data
    };
    return returnData;
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  }
};

/**
 * This function is used to login with otp
 * @param identifier
 * @param otp
 * @param originalUrl
 * @param deviceId
 * @param devInfo
 * @returns
 */
const loginWithOtpFunc = async (identifier: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    WrappidLogger.logFunctionStart("loginWithOtpFunc");
    let returnData = {} as Register;
    const identifierType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(identifierType, identifier);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(userData.id, otp, identifierType);
    if (!otpCheck) {
      throw new Error("Invalid otp");
    } else {
      const data = await createSessionAndLogin(userData, originalUrl, deviceId, devInfo);
      returnData = {
        status: 200,
        resData: data
      };
    }
    return returnData;
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("loginWithOtpFunc");
  }
};


/**
 * This function is used to reset password
 * @param identifier
 * @param password
 * @param confirmPassword
 * @param otp
 * @param deviceId
 * @param devInfo
 * @param originalUrl
 * @returns
 */
const resetPasswordFunc = async (identifier: string, password: string, confirmPassword: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    WrappidLogger.logFunctionStart("resetPasswordFunc");
    let returnData = {} as Register;
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const identifierType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(identifierType, identifier);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(userData.id, otp, identifierType);
    if (!otpCheck) {
      throw new Error("Invalid otp");
    } else {
      const hashedPassword = await bcrypt.hash(password, 9); // Hash the password
      await databaseActions.update("application", "Users", { password: hashedPassword }, { where: { id: userData.id } }); // Update the password
      const data = await createSessionAndLogin(userData, originalUrl, deviceId, devInfo);
      returnData = {
        status: 200,
        resData: data
      };
    }
    return returnData;
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("resetPasswordFunc");
  }
};



/**
 * This function is used to logout
 * @param userId
 * @param deviceId
 * @returns
 */
const logoutFunc = async (userId: string, deviceId: string):Promise<LogoutResponse> => {
  try {
    WrappidLogger.logFunctionStart("logoutFunc");
    const sessions = await databaseActions.findAll("application", "SessionManagers",
      { where: { userId: userId }}
    );
    for (let session = 0; session < sessions.length; session++) {
      const currSession = sessions[session];
      if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
        const [nrows] = await databaseActions.update("application", "SessionManagers",
          { refreshToken: "" },
          {where: {id: currSession.id}}
        );
        if (nrows > 0) {
          WrappidLogger.info("Successfully logged out");
          return { status: 200, message: "Successfully logged out" };
        } else {
          WrappidLogger.error("Database error in logout");
          throw new Error("Database error in logout");
        }
      }
    }
    return { status: 204, message: "No session found!!" };
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("logoutFunc");
  }
};


/**
 * This function is used to generate new access token using refresh token
 * @param refreshToken
 * @param deviceId
 * @returns
 */
const refreshTokenFunc = async (refreshToken:string, deviceId:string):Promise<RefreshToken> => {
  try {
    WrappidLogger.logFunctionStart("refreshTokenFunc");
    let returnData = {} as RefreshToken;
    const { accessTokenSecret, refreshAccessTokenSecret, expTime } = ApplicationContext.getContext("config").jwt;

    await jwt.verify(
      refreshToken,
      refreshAccessTokenSecret,
      async (err: any, user: any) => {
        if (err) {
          WrappidLogger.error("Refresh token expired " + err);
          throw new Error("Refresh token expired");
        }
        const userId = user.userId;
        const sessions = await databaseActions.findAll(
          "application",
          "SessionManagers",
          {
            where: {
              userId: userId,
              deviceId: deviceId
            },
          }
        );
        if (sessions.length === 0) {
          WrappidLogger.error("Session not found");
          throw Error("Session not found");
        }
        WrappidLogger.info("Sessions available:" + sessions.length);
        for (let session = 0; session < sessions.length; session++) {
          const currSession = sessions[session];
          if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
            const token = refreshToken;
            const dbRefreshToken = currSession.refreshToken;
            WrappidLogger.info("Session:" + currSession.id);
            if (!token) {
              WrappidLogger.error("Invalid request");
              throw new Error("Invalid request");
            }
            if (dbRefreshToken != token) {
              WrappidLogger.error("Refresh token mismatch");
              throw new Error("Refresh token mismatch");  
            }
            const userDetails = await databaseActions.findOne(
              "application",
              "Users",
              { where: {id: userId} }
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
            returnData =  {
              status: 200,
              accessToken: accessToken,
            };
          }
        }
       
      }
    );
    return returnData;
  } catch (error:any) {
    WrappidLogger.error(error);
    throw error;
  }finally {
    WrappidLogger.logFunctionEnd("refreshTokenFunc");
  }
};

export {
  checkUserFunc,
  registerWithPasswordFunc,
  loginWithPasswordFunc,
  loginWithOtpFunc,
  resetPasswordFunc,
  logoutFunc,
  refreshTokenFunc
};