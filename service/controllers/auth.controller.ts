import { WrappidLogger } from "@wrappid/service-core";
import { Request, Response } from "express";
import { checkUserFunc, loginWithOtpFunc, loginWithPasswordFunc, logoutFunc, refreshTokenFunc, registerWithPasswordFunc, resetPasswordFunc } from "../functions/auth.functions";
import { getDeviceId } from "../functions/auth.helper.functions";
import { IUserAuthData, IUserPersonData, LoginWithOtp, LoginWithPass, RegisterWithPass, RequestBody, ResetPass, ResponseBody, UserRequest } from "../types/auth.types";


/**
 * checkLoginController
 * @description This controller is used to check if a user is exist or not, if mot it will create new user
 * @param req
 * @param res
 */
export const checkLoginController = async(req: Request<RequestBody<{ identifier: string;}>>, res: Response<ResponseBody<IUserPersonData>>)=> {
  try {
    WrappidLogger.logFunctionStart("checkLoginController");
    const identifier = req.body.identifier;
    const {status, resData } = await checkUserFunc(identifier);
    res.status(status).json({ ...resData });
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("checkLoginController");
  }
};


/**
 * registerWithPasswordController
 * @description This controller is used to register with password
 * @param req
 * @param res
 */
export const registerWithPasswordController = async(req: Request<RequestBody<RegisterWithPass>>, res: Response<ResponseBody<IUserAuthData>>)=> {
  try {
    WrappidLogger.logFunctionStart("registerWithPasswordController");
    const { identifier, password, confirmPassWord, otp } = req.body;
    const deviceId:string = await getDeviceId(req);
    const devInfo =  req.body?.devInfo || "{}";
    const originalUrl = req.originalUrl || "";
    const {status, resData } = await registerWithPasswordFunc(identifier, password, confirmPassWord, otp, deviceId, devInfo, originalUrl);
    res.status(status).json({...resData});
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("registerWithPasswordController");
  }
};


/**
 * loginWithPasswordController
 * @description This controller is used to login with password
 * @param req 
 * @param res 
 */
export const loginWithPasswordController = async(req: Request<RequestBody<LoginWithPass>>, res: Response<ResponseBody<IUserAuthData>>)=> {
  try {
    WrappidLogger.logFunctionStart("loginWithPasswordController");
    const { identifier, password } = req.body;
    const deviceId:string = await getDeviceId(req);
    const devInfo =  req.body?.devInfo || "{}";
    const originalUrl = req?.originalUrl || "";
    const {status, resData} = await loginWithPasswordFunc(identifier, password, deviceId, devInfo, originalUrl);
    res.status(status).json({...resData});
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("loginWithPasswordController");
  }
};


/**
 * loginWithOtpController
 * @description This controller is used to login with otp
 * @param req
 * @param res
 */
export const loginWithOtpController = async(req: Request<RequestBody<LoginWithOtp>>, res: Response<ResponseBody<IUserAuthData>>)=> {
  try {
    WrappidLogger.logFunctionStart("loginWithOtpController");
    const { identifier, otp } = req.body;
    const deviceId:string = await getDeviceId(req);
    const devInfo = req.body?.devInfo || "{}";
    const originalUrl = req?.originalUrl || "";
    const {status, resData} = await loginWithOtpFunc(identifier, otp, deviceId, devInfo, originalUrl);
    res.status(status).json({...resData});
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("loginWithOtpController");
  }
};


/**
 * resetPasswordController
 * @description This controller is used to reset password
 * @param req
 * @param res
 */
export const resetPasswordController = async(req: Request<RequestBody<ResetPass>>, res: Response<ResponseBody<IUserAuthData>>)=> {
  try {
    WrappidLogger.logFunctionStart("resetPasswordController");
    const { identifier, password, confirmPassword, otp } = req.body;
    const deviceId:string = await getDeviceId(req);
    const devInfo = req.body?.devInfo || "{}";
    const originalUrl = req?.originalUrl || "";
    const {status, resData} = await resetPasswordFunc(identifier, password, confirmPassword, otp, deviceId, devInfo, originalUrl);
    res.status(status).json({...resData});
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("resetPasswordController");
  }
};


/**
 * urlLoginController
 * @description This controller is used to login with url
 * @param req
 * @param res
 */
export const urlLoginController = async(req: Request, res: Response<ResponseBody<IUserAuthData>>)=> {
  try {
    WrappidLogger.logFunctionStart("urlLoginController");
    res.status(200).json({ message: "Login successful", data: {
      id: 1,
      personId:1,
      accessToken: "`", 
      refreshToken: "",
      sessionId: ""} });
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("urlLoginController");
  }
};


/**
 * logoutController
 * @description This controller is used to logout
 * @param req
 * @param res
 */
export const logoutController = async(req: UserRequest, res: Response<ResponseBody<{ message: string; }>>)=> {
  try {
    WrappidLogger.logFunctionStart("logoutController");
    const deviceId:string = await getDeviceId(req);
    const userId = req.user.userId;
    const {status, message} = await logoutFunc(userId, deviceId);
    res.status(status).json({ message: "Succesfull operation", data: { message: message} });
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("logoutController");
  }
};


/** 
 * refreshTokenController
 * @description This controller is used to generate new access token using refresh token
 * @param req
 * @param res
 */
export const refreshTokenController = async(req: Request<RequestBody<{refreshToken:string;}>>, res: Response<ResponseBody<{ accessToken: string; }>>)=> {
  try {
    WrappidLogger.logFunctionStart("refreshTokenController");
    const { refreshToken } = req.body;
    const deviceId:string = await getDeviceId(req);
    const{ status, accessToken} = await refreshTokenFunc(refreshToken, deviceId);
    res.status(status).json({ message: "Refresh token successful", data: { accessToken: accessToken}});
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", data: error.message });
  }finally{
    WrappidLogger.logFunctionEnd("refreshTokenController");
  }
};