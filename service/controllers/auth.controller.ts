import { WrappidLogger } from "@wrappid/service-core";
import { Request, Response } from "express";
import * as authFunctions from "../functions/auth.functions";
import { getDeviceId } from "../functions/auth.helper.functions";

/**
 * CheckUserExist controller
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const CheckUserExist = async (req:Request, res:Response) => {
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

/**
 * login With Password
 * @param req 
 * @param res 
 */
export const loginWithPassword = async (req:Request, res:Response) => {
  try {
    const emailOrPhone: string = req.body.emailOrPhone;
    const password: string = req.body.passWord;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.loginwithPassWord(emailOrPhone, password, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("loginWithPassword Error:: " + error);
    res.status(500).json({message: error.message});
  }
};

/**
 * login With OTP
 * @param req 
 * @param res 
 */
export const loginWithOTP = async (req:Request, res:Response) => {
  try {
    const emailOrPhone: string = req.body.emailOrPhone;
    const otp: string = req.body.otp;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.loginWithOtp(emailOrPhone, otp, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("loginWithOTP Error:: " + error);
    res.status(500).json({message: error.message});
  }
};

/**
 * Reset Password
 * @param req 
 * @param res 
 */
export const resetPassword = async(req:Request, res:Response) => {
  try {
    const emailOrPhone: string = req.body.emailOrPhone;
    const reqPassword: string = req.body.password; 
    const reqConfirmPassword: string = req.body.confirmPassword; 
    const deviceId: string = await getDeviceId(req);
    const otp: string =  req.body.otp;
    const { status, ...restData } = await authFunctions.resetPassword(emailOrPhone, reqPassword, reqConfirmPassword, otp,deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("resetPassword:: " + error);
    res.status(500).json({message: error.message});
  }
};


/**
 * Change Password
 * @param req 
 * @param res 
 */
export const changePassword = async(req:any, res:Response) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const userId: number = req?.user.userId;
    const { status, ...restData } = await authFunctions.changePassword(password, newPassword, confirmPassword, userId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("changePassword:: " + error);
    res.status(500).json({message: error.message});
  }
};




/**
 * AccessToken regenerate from refreshtoken
 * @param req 
 * @param res 
 */
export const accessToken = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("accessToken");
    const userId: number = req?.user.userId;
    const reqRefreshToken = req.body.reqRefreshToken;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData }  = await authFunctions.accessToken(reqRefreshToken, userId, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error: any) {
    WrappidLogger.error("accessToken Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("accessToken");
  }
};


/**
 * RefreshToken regenerate from refreshtoken
 * @param req 
 * @param res 
 */
export const refreshToken = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("refreshToken");
    const userId: number = req?.user.userId;
    const reqRefreshToken = req.body.reqRefreshToken;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData }  = await authFunctions.refreshToken(reqRefreshToken, userId, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error: any) {
    WrappidLogger.error("refreshToken Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("refreshToken");
  }
};



/**
 * Logout session
 * @param req 
 * @param res 
 */
export const logout = async (req: any, res: Response) => {
  try {
    WrappidLogger.logFunctionStart("logout");
    const userId: number = req?.user.userId;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.logout(userId, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error: any) {
    WrappidLogger.error("logout Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("logout");
  }
};

/**
 * Sent Otp
 * @param req 
 * @param res 
 */
export const sentOtp = async (req: any, res: Response) => {
  try {
    WrappidLogger.logFunctionStart("sentOtp");
    const templateID = req.body?.templateID;
    const serviceName = req.body?.service;
    const userId = req?.user?.userId;
    const emailOrPhone = req.body.data;
    const commType = req.body?.type;
    const test = true;
    const { status, ...restData } = await authFunctions.sentOtp(emailOrPhone, serviceName, templateID, commType, userId, test);
    res.status(status).json({status:status, restData});
  } catch (error: any) {
    WrappidLogger.error("sentOtp Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("sentOtp");
  }
};

/**
 * Register new user
 * @param req 
 * @param res 
 */
export const register = async (req:Request, res:Response) => {
  try {
    WrappidLogger.logFunctionStart("register");
    const { emailOrPhone, otp, confirmPassword, password } = req.body;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.register(emailOrPhone, otp, confirmPassword, password, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("register Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("register");
  }
};
