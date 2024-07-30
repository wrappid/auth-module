import {
  ApplicationContext,
  communicate,
  coreConstant,
  databaseActions,
  databaseProvider,
  WrappidLogger,
} from "@wrappid/service-core";

import { GenericObject } from "@wrappid/service-core/types/generic.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import Sequelize from "sequelize";
import constant from "../constants/constants";
import {
  checkOtp,
  checkPassword,
  clearValidatePhoneEmail,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
  // createLoginLogs,
  genarateAccessToken,
  resetPasswordCheck,
} from "./auth.helper.functions";
import { createUser } from "./user.functions";


/**
 * user ExistenceChecker function weather user exist 
 * @param emailOrPhone 
 * @returns 
 */
const userExistenceChecker = async (emailOrPhone: string) => {
  try {
    WrappidLogger.logFunctionStart("userExistenceChecker");
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb: GenericObject = {};
    let responseObj: GenericObject = {};
    if (ob.type === COMMUNICATION_EMAIL) whereOb = { email: emailOrPhone };
    else if (ob.type === COMMUNICATION_SMS) whereOb = { phone: emailOrPhone };
    else {
      WrappidLogger.info("Not a valid email or phone");
      responseObj = { staus: 500, message: "Not a valid email or phone" };
    }
    const data = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    if (data) {
      WrappidLogger.info("User found " + data.id);
      responseObj = { status: 200, message: "User found", data: data };
    } else {
      if (ob.valid) {
        const userBody = whereOb;
        responseObj = createUser(userBody, emailOrPhone, ob );
        WrappidLogger.info("New User created");
      } else {
        console.error("Not a valid mail or phone:", emailOrPhone);
        responseObj = { status: 405, message: "Not valid phone or email" };
      }
    }
    return responseObj;
  } catch (err: any) {
    WrappidLogger.info("Error in check register " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("userExistenceChecker");
  }
};


/**
 * login with password
 * @param emailOrPhone 
 * @param passWord 
 * @param deviceId 
 * @returns 
 */
const loginwithPassWord = async (emailOrPhone: string, passWord: string, deviceId: string) => {
  try {
    WrappidLogger.logFunctionStart("loginHelper");
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb: GenericObject = {};

    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
    } else if (ob.type == COMMUNICATION_SMS) {
      whereOb = { phone: emailOrPhone };
    } else {
      WrappidLogger.info("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    const userDetails = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    if (!userDetails) {
      WrappidLogger.info("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (userDetails.status !== "active") {
      WrappidLogger.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      const userId = userDetails.id;
      const mail = userDetails.email;
      const phone = userDetails.phone;

      const personData = await databaseActions.findOne("ums", "Persons", {
        attributes: ["id"],
        where: { userID: userId },
      });
      WrappidLogger.info("Person details fetched");

      if (!checkPassword( passWord, userDetails.password)) {
        console.error("Invalid password");
        return { status: 401, message: "Invalid password" };
      }

      const { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );
      WrappidLogger.info("Tokens generate done");

      const sessions = await databaseActions.findAll(
        "ums",
        "SessionManagers",
        {
          where: {
            userId: userId,
          },
        }
      );

      WrappidLogger.info("All sessions fetchd: " + sessions.length);
      let found = false;

      const result = await databaseProvider.ums.sequelize.transaction(
        async (transaction: Sequelize.Transaction) => {
          for (let session = 0; session < sessions.length; session++) {
            const currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              WrappidLogger.info("*****************************");
              WrappidLogger.info("session found " + currSession.id);
              WrappidLogger.info("*****************************");
              found = true;

              const [nrows] = await databaseActions.update(
                "ums",
                "SessionManagers",
                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: transaction,
                }
              );

              if (nrows > 0) {
                WrappidLogger.info("Login Success");
                // get person id
                const person = await databaseActions.findOne(
                  "ums",
                  "Persons",
                  {
                    where: {
                      userID: userId,
                    },
                  }
                );
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

          // Creating new session
          if (!found) {
            const newSession = await databaseActions.create(
              "ums",
              "SessionManagers",
              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: transaction,
              }
            );
            WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);
            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: personData.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );
      return result;
    }
  } catch (error: any) {
    WrappidLogger.info("Error in login: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("loginHelper");
  }
};


/**
 *  Login With OTP
 * @param emailOrPhone 
 * @param otp 
 * @param deviceId 
 * @returns 
 */
const loginWithOtp = async (emailOrPhone:string, otp:string, deviceId:string) => {
  try {
    WrappidLogger.logFunctionStart("loginHelper");
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb:GenericObject = {};
    let verificationOb: GenericObject = {};

    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
      verificationOb = { emailVerified: true };
    } else if (ob.type == COMMUNICATION_SMS) {
      whereOb = { phone: emailOrPhone };
      verificationOb = { phoneVerified: true };
    } else {
      WrappidLogger.info("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    const userDetails = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    if (!userDetails) {
      WrappidLogger.info("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (!userDetails.status) {
      WrappidLogger.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      const userId = userDetails.id;
      const mail = userDetails.email;
      const phone = userDetails.phone;

      const personData = await databaseActions.findOne("ums", "Persons", {
        attributes: ["id"],
        where: { userID: userId },
      });
      const personId = personData.id;
      WrappidLogger.info("Person details fetched");

      const otpCheck = await checkOtp(userId, otp, ob.type);
      if (!otpCheck) {
        WrappidLogger.info("OTP match fail");
        return { status: 500, message: "OTP does not match" };
      } else {
        WrappidLogger.info("OTP match passed");
        await databaseActions.update("ums", "Otps",
          { _status: constant.entityStatus.INACTIVE },
          { where: {
            userId: userId,
            otp: otp,
          }});
      }
      
      const { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );
      WrappidLogger.info("Tokens generate done");

      const sessions = await databaseActions.findAll(
        "ums",
        "SessionManagers",
        {
          where: {
            userId: userId,
          },
        }
      );

      WrappidLogger.info("All sessions fetchd: " + sessions.length);
      let found = false;

      const result = await databaseProvider.ums.sequelize.transaction(
        async (transaction: Sequelize.Transaction) => {
          //for otplogin update personContact verfication status
          WrappidLogger.info("PersonContacts updating due to otplogin or urllogin");
          const [checkContacts] = await databaseActions.update(
            "ums",
            "PersonContacts",
            { verified: true },
            {
              where: {
                personId: personId,
                data: emailOrPhone,
              },
              transaction: transaction,
            }
          );

          if (checkContacts == 0) {
            WrappidLogger.error("Person contact update not made, user id:" + userId+ " contact: " + emailOrPhone );
            throw "DB update error";
          } else {
            WrappidLogger.info("PersonContacts updated");
          }
          
          const [checkPerson] = await databaseActions.update(
            "ums",
            "Users",
            verificationOb,
            {
              where: {
                id: userId,
              },
              transaction: transaction,
            }
          );
          if (checkPerson == 0) {
            WrappidLogger.error("DB update error");
            throw "DB update error";
          } else {
            WrappidLogger.info("Persons table updated");
          }

          for (let session = 0; session < sessions.length; session++) {
            const currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              WrappidLogger.info("*****************************");
              WrappidLogger.info("session found " + currSession.id);
              WrappidLogger.info("*****************************");
              found = true;

              const [nrows] = await databaseActions.update(
                "ums",
                "SessionManagers",
                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: transaction,
                }
              );

              if (nrows > 0) {
                WrappidLogger.info("Login Success");
                // createLoginLogs(req.originalUrl, userId, req.body?.devInfo);
                return {
                  status: 200,
                  message: "Successfully login",
                  id: userId,
                  personId: personId,
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
              "ums",
              "SessionManagers",
              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: transaction,
              }
            );
            WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);

            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: personId,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );
      return result;
    }
  }
  catch (error: any) {
    WrappidLogger.info("Error in loginwithOtp: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("loginwithOtp");
  }
};


/**
 * Reset Password
 * @param emailOrPhone 
 * @param reqPassword 
 * @param otp 
 * @param deviceId 
 * @returns 
 */
const resetPassword = async (emailOrPhone: string, reqPassword: string,reqConfirmPassword:string, otp: string, deviceId: string) => {
  try {
    WrappidLogger.logFunctionStart("loginHelper");
    
    if(reqPassword !== reqConfirmPassword){
      throw new Error ("password and confirmPassword missmatch!!");
    }
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb:GenericObject = {};
    let verificationOb:GenericObject = {};

    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
      verificationOb = { emailVerified: true };
    } else if (ob.type == COMMUNICATION_SMS) {
      whereOb = { phone: emailOrPhone };
      verificationOb = { phoneVerified: true };
    } else {
      WrappidLogger.info("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    const userDetails = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    if (!userDetails) {
      WrappidLogger.info("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (!userDetails.status) {
      WrappidLogger.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      const userId = userDetails.id;
      const mail = userDetails.email;
      const phone = userDetails.phone;
      const userUpdateOb: GenericObject = {};

      const personData = await databaseActions.findOne("ums", "Persons", {
        attributes: ["id",],
        where: { userID: userId },
      });
      WrappidLogger.info("Person details fetched");

      const otpCheck = await checkOtp(userId, otp, ob.type);
      if (!otpCheck) {
        WrappidLogger.info("OTP match fail");
        return { status: 500, message: "OTP does not match" };
      } else {
        WrappidLogger.info("OTP match passed");
        await databaseActions.update(
          "ums",
          "Otps",
          { _status: constant.entityStatus.INACTIVE },
          { where: {
            userId: userId,
            otp: otp,
          }});

        const passwordValid = resetPasswordCheck(
          reqPassword,
          userDetails.password
        );

        if (passwordValid?.success) {
          userUpdateOb["password"] = passwordValid.password;
        } else {
          return {
            status: 500,
            message: passwordValid.message,
          };
        }
      }

      const { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );
      WrappidLogger.info("Tokens generate done");

      const sessions = await databaseActions.findAll(
        "ums",
        "SessionManagers",
        {
          where: {
            userId: userId,
          },
        }
      );

      WrappidLogger.info("All sessions fetchd: " + sessions.length);
      let found = false;

      const result = await databaseProvider.ums.sequelize.transaction(
        async (transaction: Sequelize.Transaction) => {
          //Update password in db
          const [checkUser] = await databaseActions.update(
            "ums",
            "Users",
            {   ...userUpdateOb },
            {
              where: {
                id: userId,
              },
            },{ transaction: transaction }
          );
          if (checkUser == 0) {
            WrappidLogger.error("DB update error");
            throw "DB update error";
          }

          const [checkPerson] = await databaseActions.update(
            "ums",
            "Users",
            verificationOb,
            {
              where: {
                id: userId,
              },
              transaction: transaction,
            }
          );
          if (checkPerson == 0) {
            WrappidLogger.error("DB update error");
            throw "DB update error";
          } else {
            WrappidLogger.info("Persons table updated");
          }

          //for otplogin update personContact verfication status
          WrappidLogger.info("PersonContacts updating due to otplogin");
          const [checkContacts] = await databaseActions.update(
            "ums",
            "PersonContacts",
            { verified: true },
            {
              where: {
                personId: personData.id,
                data: emailOrPhone,
              },
              transaction: transaction,
            }
          );
 
          if (checkContacts == 0) {
            WrappidLogger.error("Person contact update not made, user id:" + userId+ " contact: " + emailOrPhone );
            throw "DB update error";
          } else {
            WrappidLogger.info("PersonContacts updated");
          }

          for (let session = 0; session < sessions.length; session++) {
            const currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              WrappidLogger.info("*****************************");
              WrappidLogger.info("session found " + currSession.id);
              WrappidLogger.info("*****************************");
              found = true;

              const [nrows] = await databaseActions.update(
                "ums",
                "SessionManagers",
                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: transaction,
                }
              );

              if (nrows > 0) {
                WrappidLogger.info("Login Success");
                return {
                  status: 200,
                  message: "Successfully login",
                  id: userId,
                  personId: personData.id,
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
              "ums",
              "SessionManagers",
              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: transaction,
              }
            );
            WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);
            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: personData.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );
      return result;
    }
  } catch (error: any) {
    WrappidLogger.info("Error in login: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("loginHelper");
  }
};


/**
 * Change Password
 * @param password 
 * @param newPassword 
 * @param confirmPassword 
 * @param userId 
 * @returns 
 */
const changePassword = async (password:string, newPassword:string, confirmPassword:string, userId:number) => {
  try {
    WrappidLogger.logFunctionStart("postChangePasswordFunc");

    if (password === newPassword) {
      WrappidLogger.error("Password can't be same.");
      throw new Error("Password can't be same.");
    }
    const user = await databaseActions.findOne("ums", "Users", {
      where: {
        id: userId,
      },
    });
    const oldPassExist = checkPassword(password, user.password);


    if (oldPassExist && newPassword === confirmPassword) {
      const result = await databaseActions.update(
        "ums",
        "Users",
        { password: bcrypt.hashSync(newPassword, 9) },
        {
          where: {
            id: userId,
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
  } catch (error: any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("postChangePasswordFunc");
  }
};


/**
 * AccessToken regenerate from refreshtoken
 * @param reqRefreshToken 
 * @param userId 
 * @param deviceId 
 * @returns 
 */
const accessToken = async (reqRefreshToken:string, userId:number, deviceId: string): Promise<any> => {
  try {
    WrappidLogger.logFunctionStart("accessToken");
    const {
      accessTokenSecret,
      refreshAccessTokenSecret,
      expTime,
    } = ApplicationContext.getContext("config").jwt;

    jwt.verify(reqRefreshToken, refreshAccessTokenSecret);
    const sessions = await databaseActions.findAll(
      "ums",
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
        const token = reqRefreshToken;
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
          "ums",
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
      
  } catch (error: any) {
    WrappidLogger.error("Database error in access token: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("accessToken");
  }
};


/**
 * Refresh token regenerate from refreshtoken
 * @param reqRefreshToken 
 * @param userId 
 * @param deviceId 
 * @returns 
 */
const refreshToken = async(reqRefreshToken:string, userId:number, deviceId: string) => {
  try {
    WrappidLogger.logFunctionStart("refreshToken");
    const {
      refreshAccessTokenSecret,
      expTime,
    } = ApplicationContext.getContext("config").jwt;

    jwt.verify(reqRefreshToken, refreshAccessTokenSecret);
    const sessions = await databaseActions.findAll(
      "ums",
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
        const token = reqRefreshToken;
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
          "ums",
          "Users",
          {
            where: {
              id: userId,
            }
          }
        );
        const newRefreshToken = jwt.sign(
          {
            userId: userDetails.id,
            email: userDetails.email,
            phone: userDetails.phone,
            roleId: userDetails.roleId,
          },
          refreshAccessTokenSecret,
          { expiresIn: expTime }
        );
        WrappidLogger.info("Refresh token refreshed");
        return {
          status: 200,
          refreshToken: newRefreshToken,
        };
      }
    }
    WrappidLogger.info("session not found");
    return {
      status: 401,
      message: "session not found",
    };
      
  } catch (error: any) {
    WrappidLogger.error("Database error in refresh token: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("refreshToken");
  }
};


/**
 * Logout from session
 * @param userId 
 * @param deviceId 
 * @returns 
 */
const logout = async (userId:number, deviceId: any) => {
  try {
    WrappidLogger.logFunctionStart("logoutHelper");
    const sessions = await databaseActions.findAll(
      "ums",
      "SessionManagers",
      {
        where: {
          userId: userId,
        },
      }
    );
    for (let session = 0; session < sessions.length; session++) {
      const currSession = sessions[session];
      if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
        const [nrows] = await databaseActions.update(
          "ums",
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
    return { status:204, message: "No session found!!" };
  } catch (error: any) {
    WrappidLogger.error("Database error in logout" + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("logoutHelper");
  }
};


/**
 * Sent One Time Password
 * @param serviceName 
 * @param emailOrPhone 
 * @param templateID 
 * @param commType 
 * @param userId 
 * @param test 
 * @returns 
 */
const sentOtp = async (  emailOrPhone:string,serviceName?:string, templateID?:string, commType?:string, userId?:number, test?:boolean) => {
  try {
    WrappidLogger.logFunctionStart("sentOtp");
    const commData: any = {};
    
    if (!commType) {
      const { type }: any = clearValidatePhoneEmail(emailOrPhone);
      commType = type;
    }

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
      const user = await databaseActions.findOne("ums", "Users", {
        where:
          commType === COMMUNICATION_EMAIL
            ? {
              email: emailOrPhone,
            }
            : {
              phone: emailOrPhone,
            },
      });
      userId = user?.id;
      commData.id = user?.id;
    }
    /**
 * suggested by @pritamIT2024
 */
    if (!userId) {
      const person = await databaseActions.findOne("ums", "PersonContacts", {
        where:{
          data: emailOrPhone,
          isActive: true,
          _status : constant.entityStatus.ACTIVE
        }
      });
      const user = await databaseActions.findOne("ums", "Persons", {
        where: {
          id: person?.personId,

        }
      }); 
      userId = user?.userID;
      commData.id = user?.userID;
    }

    const contactType =
      commType === coreConstant.commType.SMS
        ? coreConstant.contact.PHONE
        : commType;
    const personContact = await databaseActions.findOne(
      "ums",
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
    if (test === true) {
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
        "ums",
        "Otps",
        { _status: coreConstant.entityStatus.INACTIVE },
        {
          where: {
            type: commType,
            userId: userId,
          },
        }
      );

      await databaseActions.create("ums", "Otps", {
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
  } catch (error: any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("sentOtp");
  }
};


/**
 * Register 
 * @param emailOrPhone 
 * @param otp 
 * @param confirmPassword 
 * @param password 
 * @param deviceId 
 * @returns 
 */
const register = async (emailOrPhone:string, otp:string, confirmPassword:string, password:string, deviceId:string ) => {
  try {
    if(password !== confirmPassword){
      throw new Error ("password and confirmPassword missmatch!!");
    }
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb: GenericObject = {};
    let verificationOb: GenericObject = {};

    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
      verificationOb = { emailVerified: true };
    } else if (ob.type == COMMUNICATION_SMS) {
      whereOb = { phone: emailOrPhone };
      verificationOb = { phoneVerified: true };
    } else {
      WrappidLogger.info("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    const userDetails = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    //Check User exist or not
    if (!userDetails) {
      WrappidLogger.info("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (!userDetails.status) {
      WrappidLogger.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      const userId = userDetails.id;
      const mail = userDetails.email;
      const phone = userDetails.phone;

      const personData = await databaseActions.findOne("ums", "Persons", {
        attributes: ["id"],
        where: { userID: userId },
      });

      const otpCheck = await checkOtp(userDetails.id, otp, ob.type);
      if (!otpCheck) {
        WrappidLogger.info("OTP match fail");
        throw new Error ("OTP does not match");
      }  else {
        WrappidLogger.info("OTP match passed");
        await databaseActions.update("ums", "Otps",
          { _status: constant.entityStatus.INACTIVE },
          { where: {
            userId: userId,
            otp: otp,
          }});

      }


      const { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );

      WrappidLogger.info("Tokens generate done");
      const sessions = await databaseActions.findAll(
        "ums",
        "SessionManagers",
        {
          where: {
            userId: userId,
          }
        }
      );

      WrappidLogger.info("All sessions fetchd: " + sessions.length);
      let found = false;
      const result = await databaseProvider.ums.sequelize.transaction(
        async (transaction: Sequelize.Transaction) => {
          //Update password in db
          const [checkUser] = await databaseActions.update(
            "ums",
            "Users",
            { password: bcrypt.hashSync(password, 9) },
            {
              where: {
                id: userId,
              },
            },{ transaction: transaction }
          );
          if (checkUser == 0) {
            WrappidLogger.error("DB update error");
            throw "DB update error";
          }

          const [checkPerson] = await databaseActions.update(
            "ums",
            "Users",
            verificationOb,
            {
              where: {
                id: userId,
              },
              transaction: transaction,
            }
          );
          if (checkPerson == 0) {
            WrappidLogger.error("DB update error");
            throw "DB update error";
          } else {
            WrappidLogger.info("Persons table updated");
          }

          //for otplogin update personContact verfication status
          WrappidLogger.info("PersonContacts updating due to otplogin");
          const [checkContacts] = await databaseActions.update(
            "ums",
            "PersonContacts",
            { verified: true },
            {
              where: {
                personId: personData.id,
                data: emailOrPhone,
              },
              transaction: transaction,
            }
          );

          if (checkContacts == 0) {
            WrappidLogger.error("Person contact update not made, user id:" + userId+ " contact: " + emailOrPhone );
            throw "DB update error";
          } else {
            WrappidLogger.info("PersonContacts updated");
          }

          for (let session = 0; session < sessions.length; session++) {
            const currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              WrappidLogger.info("*****************************");
              WrappidLogger.info("session found " + currSession.id);
              WrappidLogger.info("*****************************");
              found = true;

              const [nrows] = await databaseActions.update(
                "ums",
                "SessionManagers",
                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: transaction,
                }
              );

              if (nrows > 0) {
                WrappidLogger.info("Login Success");
                // createLoginLogs(req.originalUrl, userId, req.body?.devInfo);
                return {
                  status: 200,
                  message: "Successfully login",
                  id: userId,
                  personId: personData.id,
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
              "ums",
              "SessionManagers",
              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: transaction,
              }
            );
            WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);
            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: personData.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );
      return result;
    }
  } catch (error:any) {
    WrappidLogger.error(error);
    throw error;
  }
};


export {
  userExistenceChecker,
  loginwithPassWord,
  loginWithOtp,
  resetPassword,
  changePassword,
  accessToken,
  refreshToken,
  logout,
  sentOtp,
  register
};
