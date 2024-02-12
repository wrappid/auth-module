import * as authFunctions from "../functions/auth.functions";

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const checkLoginOrRegister = async (req: any, res: any) => {
  try {
    const data = await authFunctions.checkLoginOrRegisterUtil(req);
    // console.log("API Call sucessfully");
    const { status, ...restData } = data;
    res.status(status).json(restData);
  } catch (error: any) {
    console.error("checkLoginOrRegister Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const data = await authFunctions.loginHelper(req, { otpLogin: false });
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("login Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};
export const loginWithOtp = async (req: any, res: any) => {
  try {
    const data = await authFunctions.loginHelper(req, { otpLogin: true });
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("loginWithOtp Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginWithUrl = async (req: any, res: any) => {
  try {
    const data = await authFunctions.loginHelper(req, { urlLogin: true });
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("loginWithUrl Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: any, res: any) => {
  try {
    const data: any = await authFunctions.logoutHelper(req, res);
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("logout Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getIP = async (req: any, res: any) => {
  try {
    const data = await authFunctions.getIPHelper(req, res);
    const devId = req.devId;
    res.status(data?.status).json({ devId: devId });
  } catch (error: any) {
    console.error("getIP Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: any, res: any) => {
  try {
    const data: any = await authFunctions.refreshTokenHelper(req, res);
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("refreshToken Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const clientLoginInformation = async (req: any, res: any) => {
  try {
    const data = await authFunctions.clientLoginInformationHelper(req, res);
    res.status(data?.status).json(data);
  } catch (error: any) {
    console.error("refreshToken Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const sentOtp = async (req: any, res: any) => {
  try {
    const data = await authFunctions.sentOtp(req, res);
    res.status(data?.status).json({ message: data?.message });
  } catch (error: any) {
    console.error("refreshToken Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const postChangePassword = async (req: any, res: any) => {
  try {
    const data = await authFunctions.postChangePasswordFunc(req, res);
    res.status(data?.status).json({ message: data?.message });
  } catch (error: any) {
    console.error("Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const postVerifyOtp = async (req: any, res: any) => {
  try {
    // res.status(200).json({message: "API call sucessfully!!"});
    const data = await authFunctions.postVerifyOtpFunc(req, res);
    const { status, ...resData } = data;
    res.status(status).json({ ...resData });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};
