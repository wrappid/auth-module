const authFunctions = require("../functions/auth.functions");
const { databaseActions } = require("@wrappid/service-core");



/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.checkLoginOrRegister = async (req, res) => {
  try {
    let data = await authFunctions.checkLoginOrRegisterUtil(req)
    // console.log("API Call sucessfully");
    let { status, ...restData } = data;
    res.status(status).json(restData);
  } catch (error) {
    console.error("checkLoginOrRegister Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    let data = await authFunctions.loginHelper(req, db)
    res.status(data?.status).json(data)
  } catch (error) {
    console.error("login Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};
module.exports.loginWithOtp = async (req, res) => {
  try {
    let data = await authFunctions.loginHelper(req,{ otpLogin: true });
    res.status(data?.status).json(data)
  } catch (error) {
    console.error("loginWithOtp Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.loginWithUrl = async (req, res) => {
  try {
    let data = await authFunctions.loginHelper(req,{ urlLogin: true });
    res.status(data?.status).json(data)
  } catch (error) {
    console.error("loginWithUrl Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports.logout = async (req, res) => {
  try {
    let data = await authFunctions.logoutHelper(req,res);
    res.status(data?.status).json(data)
  } catch (error) {
    console.error("logout Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getIP = async (req, res) => {
  try {
    let data = await authFunctions.getIPHelper(req,res);
     devId = req.devId ;
     result = req.result;
    res.status(data?.status).json({ devId: devId, result: result })
  } catch (error) {
    console.error("getIP Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports.refreshToken = async (req, res) => {
  try {
    let data = await authFunctions.refreshTokenHelper(req,res);
     res.status(data?.status).json(data)
    } catch (error) {
    console.error("refreshToken Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports.clientLoginInformation = async (req, res) => {
  try {
    let data = await authFunctions.clientLoginInformationHelper(req,res);
     res.status(data?.status).json(data)
    } catch (error) {
    console.error("refreshToken Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};


