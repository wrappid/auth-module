import { databaseActions, WrappidLogger } from "@wrappid/service-core";
import * as authFunctions from "../functions/auth.functions";

/**
 *  CheckUserExist controller
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const CheckUserExist = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("CheckUserExist");
    const emailOrPhone: string = req.body.emailOrPhone;
    const { status, ...restData } = await authFunctions.userExistenceChecker(emailOrPhone);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("CheckUserExist Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("CheckUserExist");
  }
};



export const testDatabase = async (req:any, res:any) => {
  try {
    const user = await databaseActions.findByPk("ums", "Users", 1);
    user.assignRole(user.id, "admin");    
    res.status(200).json({message: "Success"});
  } catch (error:any) {
    WrappidLogger.error(error);
    res.status(500).json({message: error.message});
  }
};