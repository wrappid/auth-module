import { ApplicationContext, coreConstant, databaseActions, databaseProvider, GenericObject, WrappidLogger } from "@wrappid/service-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeviceDetector from "node-device-detector";
import { Transaction } from "sequelize";
import constant from "../constants/constants";
import { IUserAuthData, NameData, ResponseBody } from "../types/auth.types";

// Custom type for contact validation results
type ContactType = "email" | "phone";

// Custom error class for validation
class ContactValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactValidationError";
  }
}


/**
 * Validates and determines if a string is an email or phone number
 * @param identifier - The string to validate
 * @returns ContactType - 'email' or 'phone'
 * @throws ContactValidationError if the string is neither a valid email nor phone
 */
async function getIdentifierType(identifier: string): Promise<ContactType> {
  try {
    // Remove all whitespace and special characters for phone validation
    const cleanPhone = identifier.replace(/[\s-.()+]/g, "");
  
    // Email regex pattern
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    // Phone regex pattern (international format)
    const phonePattern = /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/;

    // Check if the identifier matches the email pattern
    if (emailPattern.test(identifier)) {
      return "email";
    }
  
    // Check if the identifier matches the phone pattern
    if (phonePattern.test(cleanPhone)) {
      return "phone";
    }
  
    throw new ContactValidationError(
      `Invalid contact format: ${identifier}. Must be a valid email or phone number.`
    );
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getIdentifierType");
  }
}


/** 
 * This function is used to check if the otp is valid
 * 1. Get the latest otp from the database
 * 2. Compare the otp with the provided otp
 * 3. If equal then return true and marks as inactive
 * 4. If not equal then return false
 * @param identifier
 * @param userId
 * @param otp
 * @returns
 */
async function checkOtp(identifier:string, userId: number, otp: string, type: string): Promise<boolean> {
  WrappidLogger.logFunctionStart("checkOtp");
  try {
    let identifierType: string = type;
    if(type==="phone"){
      identifierType = "sms";
    }
    const dbData = await databaseActions.findAll("application", "Otps", {
      where: {
        type: identifierType,
        _status: coreConstant.entityStatus.ACTIVE,
        [databaseProvider.application.Sequelize.Op.or]: [
          { recipient: identifier },
          { userId: userId }
        ]
      },
      limit: 1,
      order: [["id", "DESC"]]
    });
    if (dbData.length === 0) {
      throw new Error("Otp not found");  
    }
    const dbOtp = dbData[0].dataValues.otp;
    if (Number(dbOtp) === Number(otp)) {
      await databaseActions.update("application", "Otps", { _status: coreConstant.entityStatus.INACTIVE }, { where: { id: dbData[0].dataValues.id } });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("checkOtp");
  }
}



/**
 * Gets the IP address from the request object
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
 * Gets the deviceid address from the request object
 * @param req 
 * @returns 
 */
async function getDeviceId(req: any): Promise<string> {
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
    let con:string = result.device.id + ip;
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
 * This function is used to generate access token and refresh token
 * 1. Get config data from context
 * 2. Generate access token and refresh token
 * 3. Return access token and refresh token
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
  userDetails: any,
  roleID:number
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
        roleId: roleID,
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
  } finally {
    WrappidLogger.logFunctionEnd("genarateAccessToken");
  }
}


/**
 * This function is used to create session and login
 * 1. Get config data from context
 * 2. Generate access token and refresh token
 * 3. Create session or get old session
 * @param userData 
 * @param originalUrl 
 * @param deviceId 
 * @param devInfo 
 */
async function createSessionAndLogin(userData:any, originalUrl:string, deviceId:string, devInfo:string):Promise<ResponseBody<IUserAuthData>> {
  try {
    WrappidLogger.logFunctionStart("createSessionAndLogin");
    let returnData = {} as ResponseBody<IUserAuthData>;

    const personData = await databaseActions.findOne(
      "application",
      "Persons",
      {
        attributes: ["id"],
        where: { userId: userData.id },
      }
    );



    // Find the primary contact records for the person
    const personContacts = await databaseActions.findAll("application", "PersonContacts", {
      where: { personId: personData.id, _status: coreConstant.entityStatus.ACTIVE, primaryFlag: true },
    });
    
    // Extract the primary email and phone/WhatsApp information
    const primaryEmail = personContacts.filter((entry: any) => entry.type === coreConstant.commType.EMAIL);
    const primaryPhone = personContacts.filter((entry: any) => (entry.type === "phone" || entry.type === "whatsapp"));
    
    const FunctionsRegistry: GenericObject = ApplicationContext.getContext(coreConstant.registry.FUNCTIONS_REGISTRY);
      
    const personMetaData = await FunctionsRegistry["getMetaDataJSON"]("PersonMetas", personData.id);
    if (!personMetaData || Object.keys(personMetaData).length <= 0) {
      throw new Error("Person meta data not found");
    }

    const fullName = getFullName({
      firstName : personMetaData?. firstName,
      lastName  :personMetaData?.lastName,
      middleName:personMetaData?. middleName,
    });

    const roleData = await databaseActions.findOne("application", "UserRoles", { where: { userID: userData.id } });
    const { refreshToken, accessToken } = genarateAccessToken(
      userData.id,
      userData.email,
      userData.phone,
      personData,
      userData,
      roleData?.roleID
    );

    const sessions = await databaseActions.findAll(
      "application",
      "SessionManagers",
      {
        where: {
          userId: userData.id
        }
      }
    );
    let found=false;

    await databaseProvider.application.sequelize.transaction(
      async (transaction: Transaction) => {
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
                transaction: transaction,
              }
            );

            if (nrows > 0) {
              WrappidLogger.info("Login Success");
              createLoginLogs(originalUrl, userData.id, devInfo);
              returnData =  {
                message: "Successfully login",
                data:{
                  id: userData.id,
                  personId: personData.id,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  sessionId: currSession.id,
                  email: primaryEmail[0]?.data,
                  emailVerified: primaryEmail[0]?.verified,
                  phone: primaryPhone[0]?.data,
                  phoneVerified: primaryPhone[0]?.verified,
                  name: fullName,
                  photoUrl: personMetaData.photoUrl,
                }
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
              userId: userData.id,
              deviceId: bcrypt.hashSync(deviceId, 9),
            },
            {
              transaction: transaction,
            }
          );
          WrappidLogger.info("Login Success with New Device, session id: " + newSession.id);
          createLoginLogs(originalUrl, userData.id, devInfo);
          returnData =  {
            message: "Successfully login with New Device",
            data:{
              id: userData.id,
              personId: personData.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
              email: primaryEmail[0]?.data,
              emailVerified: primaryEmail[0]?.verified,
              phone: primaryPhone[0]?.data,
              phoneVerified: primaryPhone[0]?.verified,
              name: fullName,
              photoUrl: personMetaData.photoUrl,
            }
          };
        }
      }
    );

    //email, emailvarifed:boolean , phone, phonevarifed:boolean, name, photo
    return returnData;
  } catch (error:any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }
}


/**
 * Generates a full name string from the provided name components
 * 
 * @param data - Object containing name components
 * @param data.firstName - First name of the person
 * @param data.middleName - Middle name of the person
 * @param data.lastName - Last name of the person
 * 
 * @returns A concatenated full name string with proper spacing.
 *          Returns "Unnamed" if no name components are provided or if they're all empty.
 * 
 * @example
 * ```typescript
 * getFullName({ firstName: "John", lastName: "Doe" })
 * // Returns: "John Doe"
 * 
 * getFullName({ firstName: "John", middleName: "William", lastName: "Doe" })
 * // Returns: "John William Doe"
 * 
 * getFullName({})
 * // Returns: "Unnamed"
 * ```
 */
export function getFullName(data: NameData): string {
  let name = "";

  if (data?.firstName) {
    name += data.firstName;
  }
  if (data?.middleName) {
    name += " " + data.middleName;
  }
  if (data?.lastName) {
    name += " " + data.lastName;
  }
  return name && name.length > 0 ? name : "Unnamed";
}








/**
 * This function is used to create login logs
 * @param path
 * @param userId
 * @param extraInfo
 */
async function createLoginLogs(path: string, userId: number, extraInfo: any = "{}") {
  try {
    WrappidLogger.logFunctionStart("createLoginLogs");
    WrappidLogger.info("Login logs created for userID:" + userId + " path:"+ path);
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
  } finally {
    WrappidLogger.logFunctionEnd("createLoginLogs");
  }
}



/**
* Determines the appropriate communication template based on identifier type and service.
* 
* @param {string} identifierType - Type of identifier ('email' or 'phone')
* @param {string} serviceName - The service requesting the template
*   Supported services:
*   - 'loginWithOtp': For OTP-based login
*   - 'reset': For password reset
*   - 'register': For new user registration
* 
* @returns {Promise<string>} A promise that resolves to the template name
* 
* @throws {Error} Propagates any errors that occur during template selection
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Determines template based on identifier type:
*    For Email:
*    - Login OTP: SENT_OTP_LOGIN_WITH_OTP_MAIL_EN
*    - Reset Password: SENT_OTP_RESET_PASSWORD_MAIL_EN
*    - Registration: SENT_OTP_MAIL_EN
*    
*    For Phone:
*    - Login OTP: SENT_OTP_LOGIN_WITH_OTP_SMS_EN
*    - Reset Password: SENT_OTP_RESET_PASSWORD_OTP_SMS_EN
*    - Registration: SENT_OTP_SMS_EN
* 3. Logs function exit
* 
* Template Selection:
* - Uses separate templates for email and SMS
* - Defaults to basic OTP template if service is not recognized
* - All templates are in English ('EN' suffix)
* - Templates are defined in communication constants
* 
* Note: The function uses constants from the application's
* constant configuration for both contact types and
* communication template identifiers.
*/
async function getTemplateName(identifierType:string, serviceName:string) {
  try {
    WrappidLogger.logFunctionStart("getTemplateID");
 
    let templateName = "";
    if (identifierType === constant.contact.EMAIL) {
      switch (serviceName) {
        case "loginWithOtp":
          templateName = constant.communication.SENT_OTP_LOGIN_WITH_OTP_MAIL_EN;
          break;
        case "reset":
          templateName = constant.communication.SENT_OTP_RESET_PASSWORD_MAIL_EN;
          break;
        case "register":
          templateName = constant.communication.SENT_OTP_MAIL_EN;
          break;
        default:
          templateName = constant.communication.SENT_OTP_MAIL_EN;
          break;
      }
    }

    if(identifierType === constant.contact.PHONE){
      switch (serviceName) {
        case "loginWithOtp":
          templateName = constant.communication.SENT_OTP_LOGIN_WITH_OTP_SMS_EN;
          break;
        case "reset":
          templateName = constant.communication.SENT_OTP_RESET_PASSWORD_OTP_SMS_EN;
          break;
        case "register":
          templateName = constant.communication.SENT_OTP_SMS_EN;
          break;
        default:
          templateName = constant.communication.SENT_OTP_SMS_EN;
          break;
      }
    }
    return templateName;
  } catch (error:any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getTemplateID");
  }
}

/**
 * Formats and validates Indian phone numbers to a standardized 10-digit format.
 * 
 * @description
 * This function takes a phone number in various formats and converts it to a standardized
 * 10-digit format by:
 * 1. Removing country code ('+91' or '91')
 * 2. Removing all special characters (spaces, hyphens, etc.)
 * 3. Validating the resulting number
 * 
 * Valid input formats include:
 * - 10-digit number: '9876543210'
 * - With country code: '+919876543210' or '919876543210'
 * - With separators: '91-98765-43210' or '+91 98765 43210'
 * 
 * Validation rules:
 * - Must be exactly 10 digits after removing country code
 * - Must start with 6, 7, 8, or 9
 * - Can include spaces, hyphens as separators
 * - Can include '+91' or '91' as country code
 * 
 * @param {string|number} phone - The phone number to format. Can be string or number.
 * 
 * @returns {string|null} Returns:
 * - A 10-digit string if valid
 * - null if invalid
 * 
 * @example
 * // Returns "9876543210"
 * formatPhoneNumber("9876543210")
 * formatPhoneNumber("+919876543210")
 * formatPhoneNumber("91-98765-43210")
 * formatPhoneNumber("+91 98765 43210")
 * 
 * // Throw error
 * formatPhoneNumber("123456789")     // Invalid: Too short
 * formatPhoneNumber("5876543210")    // Invalid: Starts with 5
 * formatPhoneNumber("98765432100")   // Invalid: Too long
 * formatPhoneNumber("abc9876543210") // Invalid: Contains letters
 * 
 */
const formatPhoneNumber = (phone:string) => {
  try {
    WrappidLogger.logFunctionStart("formatPhoneNumber");
    // Convert to string if number is passed
    const phoneStr = phone.toString();

    // Remove all non-digit characters (spaces, hyphens, etc.)
    const cleanPhone = phoneStr.replace(/\D/g, "");

    // Check if the clean number starts with country code (91)
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      return cleanPhone.slice(2);
    }

    // Check if it's a valid 10-digit number
    if (cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone)) {
      return cleanPhone;
    }

    // Return null for invalid numbers
    throw new Error("Invalid phone number");
  } catch (error:any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("formatPhoneNumber");
  }
  // Return null if input is null or undefined
  if (!phone){
    throw new Error("Phone number cannot be null or undefined");
  }
};


export {
  getIdentifierType,
  getDeviceId,
  createSessionAndLogin,
  genarateAccessToken,
  checkOtp,
  getTemplateName,
  formatPhoneNumber
};