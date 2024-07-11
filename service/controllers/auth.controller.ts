import { WrappidLogger } from "@wrappid/service-core";
import * as authFunctions from "../functions/auth.functions";

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const checkLoginOrRegister = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("checkLoginOrRegister");
    const { status, ...restData } = await authFunctions.checkLoginOrRegisterUtil(req);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("checkLoginOrRegister Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("checkLoginOrRegister");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const login = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("login");
    const { status, ...restData } = await authFunctions.loginHelper(req, { otpLogin: false });
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("login Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("login");
  }
};
/**
 * 
 * @param req 
 * @param res 
 */
export const loginWithOtp = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("loginWithOtp");
    const { status, ...restData } = await authFunctions.loginHelper(req, { otpLogin: true });
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("loginWithOtp Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("loginWithOtp");

  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const loginWithUrl = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("loginWithUrl");
    const { status, ...restData } = await authFunctions.loginHelper(req, { urlLogin: true });
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("loginWithUrl Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("loginWithUrl");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const logout = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("logout");
    const { status, ...restData } = await authFunctions.logoutHelper(req);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("logout Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("logout");

  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const getIP = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("getIP");
    const { status, ...restData } = await authFunctions.getIPHelper(req, res);
    res.status( status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("getIP Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("getIP");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const refreshToken = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("refreshToken");
    const data: any = await authFunctions.refreshTokenHelper(req, res);
    res.status(data?.status).json(data);
  } catch (error: any) {
    WrappidLogger.error("refreshToken Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("refreshToken");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const clientLoginInformation = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("clientLoginInformation");
    const { status, ...restData } = await authFunctions.clientLoginInformationHelper(req, res);
    res.status(status).json(restData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("clientLoginInformation");

  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const sentOtp = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("sentOtp");
    const { status, ...restData } = await authFunctions.sentOtp(req, res);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("refreshToken Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("sentOtp");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const postChangePassword = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("postChangePassword");
    const { status, ...restData } = await authFunctions.postChangePasswordFunc(req, res);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("postChangePassword");
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const postVerifyOtp = async (req: any, res: any) => {
  try {
    WrappidLogger.logFunctionStart("postVerifyOtp");
    const  { status, ...restData } = await authFunctions.postVerifyOtpFunc(req, res);
    res.status(status).json(restData);
  } catch (error: any) {
    WrappidLogger.error("postVerifyOtp Error:: " + error);
    res.status(500).json({ message: error.message });
  } finally {
    WrappidLogger.logFunctionEnd("postVerifyOtp");
  }
};
