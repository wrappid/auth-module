import {
  ApplicationContext,
  communicate,
  coreConstant,
  databaseActions,
  databaseProvider,
  GenericObject,
  WrappidLogger,
} from "@wrappid/service-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { Transaction } from "sequelize";
import constant from "../constants/constants";
import { IApiResponse, LogoutResponse, RefreshToken, Register } from "../types/auth.types";
import { checkOtp, createSessionAndLogin, formatPhoneNumber, getIdentifierType, getTemplateName } from "./auth.helper.functions";
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
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    const data = await checkUserExistance(identifierType, identifier, constant.entityStatus.ACTIVE);
    if (data) {
      const personData = await databaseActions.findOne("application", "Persons", { where: { userId: data.id } });
      if (personData && personData?.id <= 0) {
        throw new Error("Person data not found");
      }
      
      const FunctionsRegistry: GenericObject = ApplicationContext.getContext(coreConstant.registry.FUNCTIONS_REGISTRY);
      
      const personMetaData = await FunctionsRegistry["getMetaDataJSON"]("PersonMetas", personData.id);
      if (!personMetaData || Object.keys(personMetaData).length <= 0) {
        throw new Error("Person meta data not found");
      }

      returnData = {
        status: 200,
        resData: {
          message: "User already exists",
          data: {
            name: personMetaData.firstName,
            photoUrl: personMetaData.photoUrl,
            "identifier": identifier
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
 * Registers a user with a password and creates their initial session.
 * 
 * @param {string} identifier - The user's email or phone number for identification
 * @param {string} password - The desired password for the account
 * @param {string} confirmPassword - Password confirmation to ensure matching
 * @param {string} otp - One-time password for verification
 * @param {string} deviceId - Unique identifier for the user's device
 * @param {string} devInfo - Device information/metadata
 * @param {string} originalUrl - The original URL
 * 
 * @returns {Promise<Register>} A promise that resolves to an object containing:
 *   - status: HTTP status code (200 for success)
 *   - resData: Session and login information
 * 
 * @throws {Error} Throws an error in the following cases:
 *   - "Passwords do not match" - If password and confirmPassword don't match
 *   - "User does not exist" - If the identifier is not found in the system
 *   - "Invalid otp" - If the provided OTP is incorrect or expired
 * 
 * @description
 * This function performs the following operations:
 * 1. Validates password match
 * 2. Determines identifier type (email/phone)
 * 3. Verifies user existence
 * 4. Validates OTP
 * 5. Hashes and updates password
 * 6. Creates user session
 * 7. Assigns basic user role (roleId: 1)
 * 
 * The function should be used in the password registration flow after initial user creation
 * and OTP verification.
 */
const registerWithPasswordFunc = async (identifier: string, password: string, confirmPassword: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const identifierType: string = await getIdentifierType(identifier);
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    const userData = await checkUserExistance(identifierType, identifier, constant.entityStatus.NEW);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(identifier, userData.id, otp, identifierType);

    if (!otpCheck) {
      throw new Error("Invalid otp");
    } else {
      const hashedPassword = await bcrypt.hash(password, 9); // Hash the password
      await databaseProvider.application.sequelize.transaction(
        async (transaction: Transaction) => {
          await databaseActions.update("application", "Users", { password: hashedPassword, _status:constant.entityStatus.ACTIVE }, { where: { id: userData.id } }, {transaction}); // Update the password
          await databaseActions.update("application", "Persons", { _status:constant.entityStatus.ACTIVE }, { where: { userId: userData.id } }, {transaction});
          const personData = await databaseActions.findOne("application", "Persons", { where: { userId: userData.id } }, {transaction});
          await databaseActions.update("application", "PersonContacts", { _status:constant.entityStatus.ACTIVE, verified:true, primaryFlag:true }, { where: { personId: personData.id, type: identifierType, data:identifier } },{transaction});
        });
    }
    const data = await createSessionAndLogin(userData, originalUrl, deviceId, devInfo);
    return{
      status: 200,
      resData: data
    };
  } catch (error: any) {
    WrappidLogger.error(error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("registerWithPasswordFunc");
  }
};


/**
 * Authenticates a user with their identifier and password, and creates a login session.
 * 
 * @param {string} identifier - The user's email or phone number for identification
 * @param {string} password - The user's password for authentication
 * @param {string} deviceId - Unique identifier for the user's device
 * @param {string} devInfo - Device information/metadata
 * @param {string} originalUrl - The original URL for redirect after login
 * 
 * @returns {Promise<Register>} A promise that resolves to an object containing:
 *   - status: HTTP status code (200 for success)
 *   - resData: Session and login information
 * 
 * @throws {Error} Throws an error in the following cases:
 *   - "User does not exist" - If the identifier is not found in the system
 *   - "Invalid password" - If the provided password doesn't match stored hash
 * 
 * @description
 * This function performs the following operations:
 * 1. Determines identifier type (email/phone)
 * 2. Verifies user existence in the system
 * 3. Validates password against stored hash
 * 4. Creates new login session with device information
 * 
 * The function implements standard password-based authentication flow
 * and should be used as the primary login endpoint for password authentication.
 */
const loginWithPasswordFunc = async (identifier: string, password: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    let returnData = {} as Register;
    const identifierType: string = await getIdentifierType(identifier);
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    const userData = await checkUserExistance(identifierType, identifier, constant.entityStatus.ACTIVE);
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
  }finally{
    WrappidLogger.logFunctionEnd("loginWithPasswordFunc");
  }
};


/**
 * Authenticates a user using a one-time password (OTP) and creates a login session.
 * 
 * @param {string} identifier - The user's email or phone number for identification
 * @param {string} otp - One-time password for authentication
 * @param {string} deviceId - Unique identifier for the user's device
 * @param {string} devInfo - Device information/metadata
 * @param {string} originalUrl - The original URL for redirect after login
 * 
 * @returns {Promise<Register>} A promise that resolves to an object containing:
 *   - status: HTTP status code (200 for success)
 *   - resData: Session and login information
 * 
 * @throws {Error} Throws an error in the following cases:
 *   - "User does not exist" - If the identifier is not found in the system
 *   - "Invalid otp" - If the provided OTP is incorrect or expired
 * 
 * @description
 * This function performs the following operations:
 * 1. Logs function entry
 * 2. Determines identifier type (email/phone)
 * 3. Verifies user existence in the system
 * 4. Validates the provided OTP
 * 5. Creates new login session with device information
 * 6. Logs function exit
 * 
 * The function implements OTP-based authentication flow and can be used as an
 * alternative to password-based login or for two-factor authentication scenarios.
 * All function execution is logged for debugging and monitoring purposes.
 */
const loginWithOtpFunc = async (identifier: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    WrappidLogger.logFunctionStart("loginWithOtpFunc");
    let returnData = {} as Register;
    const identifierType: string = await getIdentifierType(identifier);
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    const userData = await checkUserExistance(identifierType, identifier, constant.entityStatus.ACTIVE);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(identifier, userData.id, otp, identifierType);
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
* Resets a user's password using OTP verification and creates a new login session.
* 
* @param {string} identifier - The user's email or phone number for identification
* @param {string} password - The new password to set
* @param {string} confirmPassword - Password confirmation to ensure matching
* @param {string} otp - One-time password for verification
* @param {string} deviceId - Unique identifier for the user's device
* @param {string} devInfo - Device information/metadata
* @param {string} originalUrl - The original URL for redirect after reset
* 
* @returns {Promise<Register>} A promise that resolves to an object containing:
*   - status: HTTP status code (200 for success)
*   - resData: Session and login information
* 
* @throws {Error} Throws an error in the following cases:
*   - "Passwords do not match" - If password and confirmPassword don't match
*   - "User does not exist" - If the identifier is not found in the system
*   - "Invalid otp" - If the provided OTP is incorrect or expired
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Validates password match
* 3. Determines identifier type (email/phone)
* 4. Verifies user existence
* 5. Validates OTP
* 6. Hashes and updates the new password
* 7. Creates new login session
* 8. Logs function exit
* 
* The function implements a secure password reset flow with OTP verification
* and automatically logs the user in after successful password reset.
* All function execution is logged for debugging and monitoring purposes.
*/
const resetPasswordFunc = async (identifier: string, password: string, confirmPassword: string, otp: string, deviceId: string, devInfo: string, originalUrl: string): Promise<Register> => {
  try {
    WrappidLogger.logFunctionStart("resetPasswordFunc");
    let returnData = {} as Register;
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const identifierType: string = await getIdentifierType(identifier);
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    const userData = await checkUserExistance(identifierType, identifier, constant.entityStatus.ACTIVE);
    if (!userData) {
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(identifier, userData.id, otp, identifierType);
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
* Logs out a user by invalidating their session for the specified device.
* 
* @param {string} userId - The unique identifier of the user
* @param {string} deviceId - The device identifier to logout from
* 
* @returns {Promise<LogoutResponse>} A promise that resolves to an object containing:
*   - status: HTTP status code (200 for successful logout, 204 if no session found)
*   - message: Description of the operation result
* 
* @throws {Error} Throws an error in the following cases:
*   - "Database error in logout" - If session update fails
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Retrieves all sessions for the user
* 3. Finds the session matching the provided device ID
* 4. Invalidates the session by clearing the refresh token
* 5. Logs function exit
* 
* Response Status Codes:
* - 200: Successfully logged out from the device
* - 204: No active session found for the device
* 
* The function implements secure logout by:
* - Matching hashed device IDs for verification
* - Invalidating refresh tokens instead of deleting sessions
* - Logging all operations for audit purposes
* 
* Note: The function only logs out from the specified device,
* not all devices associated with the user.
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
* Refreshes the access token using a valid refresh token and device ID.
* 
* @param {string} refreshToken - The current refresh token
* @param {string} deviceId - The device identifier for session validation
* 
* @returns {Promise<RefreshToken>} A promise that resolves to an object containing:
*   - status: HTTP status code (200 for success)
*   - accessToken: Newly generated access token
* 
* @throws {Error} Throws an error in the following cases:
*   - "Refresh token expired" - If the provided refresh token is no longer valid
*   - "Session not found" - If no active session exists for the user/device
*   - "Invalid request" - If refresh token is missing
*   - "Refresh token mismatch" - If provided token doesn't match stored token
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Verifies the refresh token validity
* 3. Extracts user ID from the refresh token
* 4. Finds matching session(s) for user ID and device
* 5. Validates device ID using bcrypt comparison
* 6. Verifies refresh token matches stored token
* 7. Retrieves user details
* 8. Generates new access token
* 9. Logs function exit
* 
* Security measures:
* - Validates both refresh token and device ID
* - Uses JWT verification for token validation
* - Implements bcrypt comparison for device ID
* - Checks token matches stored value
* - Includes user roles in new access token
* 
* The new access token includes:
* - User ID
* - Email
* - Phone
* - Role ID
* - Configured expiration time
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


/**
* Generates and sends an OTP (One-Time Password) to a specified identifier (email/phone).
* 
* @param {string} identifier - The email or phone number to send OTP to
* @param {string} serviceName - The service requesting OTP (e.g., 'login', 'registration')
* @param {string} [userID] - Optional user ID for existing users
* 
* @returns {Promise<{status: number, message: string}>} A promise that resolves to:
*   - status: HTTP status code (200 for success)
*   - message: Description of operation result
* 
* @throws {Error} Throws an error in the following cases:
*   - If communication service fails to send OTP
*   - Any errors during template retrieval or database operations
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Determines identifier type (email/phone)
* 3. Retrieves appropriate template for communication
* 4. Generates numeric OTP based on configured length
* 5. Converts 'phone' type to 'sms' for communication service
* 6. Sends OTP using communication service
* 7. Deactivates any existing OTPs for the user/identifier
* 8. Creates new active OTP record
* 9. Logs function exit
* 
* OTP Generation Features:
* - Configurable length
* - Numeric only (no special chars, no alphabets)
* - One active OTP per user/identifier
* 
* Security Measures:
* - Deactivates previous OTPs before creating new ones
* - Associates OTPs with both identifier and userID (if provided)
* - Uses template-based communication
* - Maintains OTP status tracking
* 
* Database Operations:
* - Updates existing OTPs to inactive status
* - Creates new OTP record with active status
* - Stores recipient, OTP value, type, and user association
*/
const sentOtpFunc = async (identifier:string, serviceName:string, userID?:any ) => {
  try {
    WrappidLogger.logFunctionStart("sentOtpFunc");
    let identifierType: string = await getIdentifierType(identifier);
    if (identifierType === "phone") {
      identifier = formatPhoneNumber(identifier);
    }
    // If userID not proveide
    if(userID === undefined){
      userID = null;
    }
  
    const templateName = await getTemplateName(identifierType, serviceName);
   
    // Generate otp
    const genetatedOTP = otpGenerator.generate(
      ApplicationContext.getContext("config").wrappid.otpLength,
      {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      }
    );
    const commData:{otp:string} = {otp:""};
    if (genetatedOTP) {
      commData.otp = genetatedOTP;
    }
    
    if(identifierType==="phone"){
      identifierType = "sms";
    }
    // Calling service-core communicate function for sending otp
    const commResult = await communicate({
      commType: identifierType,
      commRecipients: {
        to: [identifier],
      },
      commData,
      commTemplateID: templateName,
      directFlag: true,
      errorFlag: true,
    });

    if (commResult) {
      // All otp of user mark as inactive
      await databaseActions.update(
        "application",
        "Otps",
        { _status: coreConstant.entityStatus.INACTIVE },
        {where: { type: identifierType,
          [databaseProvider.application.Sequelize.Op.or]: [
            { recipient: identifier },
            { userId: userID }
          ]
        }}

      );

      // Current otp mark as active
      await databaseActions.create("application", "Otps", {
        recipient: identifier,
        otp: genetatedOTP,
        type: identifierType,
        _status: coreConstant.entityStatus.ACTIVE,
        userId: userID,
      });

      WrappidLogger.info(`OTP ${identifierType} sent successfully.`);
      return { status: 200, message: `OTP ${identifierType} sent successfully.` };
    } else {
      throw new Error(`OTP ${identifierType} sent failed.`);
    }
  } catch (err: any) {
    WrappidLogger.error("Error: " + err);
    throw err;
  } finally {
    WrappidLogger.logFunctionEnd("sentOtpFunc");
  }
};



export {
  checkUserFunc, loginWithOtpFunc, loginWithPasswordFunc, logoutFunc,
  refreshTokenFunc, registerWithPasswordFunc, resetPasswordFunc, sentOtpFunc
};
