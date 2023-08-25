const authController = require("./controllers/auth.controller")

const controllersRegistry = {
    checkLoginOrRegister: authController.checkLoginOrRegister,
    login: authController.login,
    logout: authController.logout,
    loginWithOtp: authController.loginWithOtp,
    getIP: authController.getIP,
    loginWithUrl: authController.loginWithUrl,
    clientLoginInformation: authController.clientLoginInformation,
    refreshToken: authController.refreshToken,
    sentOtp: authController.sentOtp
};

exports.controllersRegistry = controllersRegistry;