import { WrappidLogger } from "@wrappid/service-core";
import { Request, Response } from "express";
import {google} from "googleapis";
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
    WrappidLogger.logFunctionStart("loginWithPassword");
    const emailOrPhone: string = req.body.emailOrPhone;
    const password: string = req.body.passWord;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.loginwithPassWord(emailOrPhone, password, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("loginWithPassword Error:: " + error);
    res.status(500).json({message: error.message});
  }finally{
    WrappidLogger.logFunctionEnd("loginWithPassword");
  }
};


/**
 * login With OTP
 * @param req 
 * @param res 
 */
export const loginWithOTP = async (req:Request, res:Response) => {
  try {
    WrappidLogger.logFunctionStart("loginWithOTP");
    const emailOrPhone: string = req.body.emailOrPhone;
    const otp: string = req.body.otp;
    const deviceId: string = await getDeviceId(req);
    const { status, ...restData } = await authFunctions.loginWithOtp(emailOrPhone, otp, deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("loginWithOTP Error:: " + error);
    res.status(500).json({message: error.message});
  }finally{
    WrappidLogger.logFunctionEnd("loginWithOTP");
  }
};


/**
 * Reset Password
 * @param req 
 * @param res 
 */
export const resetPassword = async(req:Request, res:Response) => {
  try {
    WrappidLogger.logFunctionStart("resetPassword");
    const emailOrPhone: string = req.body.emailOrPhone;
    const reqPassword: string = req.body.password; 
    const reqConfirmPassword: string = req.body.confirmPassword; 
    const deviceId: string = await getDeviceId(req);
    const otp: string =  req.body.otp;
    const { status, ...restData } = await authFunctions.resetPassword(emailOrPhone, reqPassword, reqConfirmPassword, otp,deviceId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("resetPassword Error:: " + error);
    res.status(500).json({message: error.message});
  }finally{
    WrappidLogger.logFunctionEnd("resetPassword");
  }
};


/**
 * Change Password
 * @param req 
 * @param res 
 */
export const changePassword = async(req:any, res:Response) => {
  try {
    WrappidLogger.logFunctionStart("changePassword");
    const { password, newPassword, confirmPassword } = req.body;
    const userId: number = req?.user.userId;
    const { status, ...restData } = await authFunctions.changePassword(password, newPassword, confirmPassword, userId);
    res.status(status).json({status:status, restData});
  } catch (error:any) {
    WrappidLogger.error("changePassword Error:: " + error);
    res.status(500).json({message: error.message});
  }finally{
    WrappidLogger.logFunctionEnd("changePassword");
  }
};


/**
 * AccessToken regenerate from refreshtoken
 * @param req 
 * @param res 
 */
export const accessToken = async (req: any, res: Response) => {
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
export const refreshToken = async (req: any, res: Response) => {
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


const oauth2Client = new google.auth.OAuth2(
  "", //Client Id
  "", //Secret ID
  "" // Callback url
);
  
const redirectUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["email", "profile"]
});
  
let auth = false;

export const googleLogin =   async (req:Request, res:Response) => {
  const oauth2 = google.oauth2({version: "v2", auth: oauth2Client});
  if (auth) {
    const userInfo = await oauth2.userinfo.v2.me.get();
    res.render("index", {buttonSpan: "Sign out", url: "http://localhost:8080/goglelogout", userInfo: userInfo.data});
  } else {
    res.render("index", {buttonSpan: "Sign in", url: redirectUrl, userInfo: {}});
  }
};
  
export const googleCallback =   async (req:Request, res:Response) => {
  const code = req.query.code as string;
  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    auth = true;
  }
  res.redirect("/googleLogin");
};
  
export const goglelogout = (req:Request, res:Response) => {
  oauth2Client.revokeCredentials().then((r:any) => console.log("revoke ", r));
  auth = false;
  res.redirect("/googleLogin");
};