import {
  coreConstant,
  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";
import bcrypt from "bcrypt";
import { IApiResponse, Register } from "../types/auth.types";
import { createSessionAndLogin, getIdentifierType } from "./auth.helper.functions";
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
const checkUserFunc = async (identifier:string):Promise<IApiResponse> => {
  try {
    WrappidLogger.logFunctionStart("checkUser");
    let returnData: IApiResponse;
    const commType: string = await getIdentifierType(identifier);
    const data = await checkUserExistance(commType, identifier);
    if(data){
      const personData = await databaseActions.findOne("application", "Persons", {where: {userId: data.id}});
      returnData =  {
        status:200,
        resData:{
          message:"User already exists",
          data:{
            userId: data.id,
            personId: personData.id
          }
        }
      };
    }else{
      returnData = await createUser(commType, identifier);
    }

    WrappidLogger.info("returnData" + returnData);
    return returnData;
  } catch (error:any) {
    WrappidLogger.error(error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("checkUser");
  }
};


/**
 * This function is used to register user with password
 * @param emailOrPhone 
 * @param password 
 * @param confirmPassWord 
 * @param otp 
 */
const registerWithPasswordFunc = async( identifier:string, password:string, confirmPassWord:string, otp:string, deviceId:string, devInfo:string, originalUrl:string ):Promise<Register> =>{
  try {
    let returnData = {} as Register;
    if(password !== confirmPassWord){
      throw new Error("Passwords do not match");
    }
    const commType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(commType, identifier);
    if(!userData){
      throw new Error("User does not exist");
    }
    const otpCheck = await checkOtp(userData.id, otp , commType);

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
  } catch (error:any) {
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
const loginWithPasswordFunc = async(identifier:string, password:string, deviceId:string, devInfo:string, originalUrl:string):Promise<Register> => {
  try {
    let returnData = {} as Register;
    const commType: string = await getIdentifierType(identifier);
    const userData = await checkUserExistance(commType, identifier);
    if(!userData){
      throw new Error("User does not exist");
    }
    const dbPassword = userData.password;
    const checkPass = bcrypt.compareSync(password, dbPassword);
    if(!checkPass){
      throw new Error("Invalid password");
    }
    const data = await createSessionAndLogin(userData,originalUrl, deviceId, devInfo);
    returnData = {
      status: 200,
      resData: data
    };
    return returnData;
  } catch (error:any) {
    WrappidLogger.error(error); 
    throw error;
  }
};




/** 
 * This function is used to check if the otp is valid
 * 1. Get the latest otp from the database
 * 2. Compare the otp with the provided otp
 * 3. If equal then return true
 * 4. If not equal then return false
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
    });
    const dbOtp = dbData[0].dataValues.otp;
    if (Number(dbOtp) === Number(otp)) {
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


export {
  checkUserFunc,
  registerWithPasswordFunc,
  loginWithPasswordFunc
};