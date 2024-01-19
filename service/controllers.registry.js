const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");

const authController = require("./controllers/auth.controller");

const {
  checkLoginOrRegister,
  login,
  postLoginWithOtp,
  postLogoutSchema,
  getIpSchema,
  refreshTokenSchema,
  postLoginWithUrl,
  getClientLoginInfo,
  sentOtp,
  postChangePassword,
  postVerifyOtp
} = require("./validations/auth.validation");

const controllersRegistry = {
  checkLoginOrRegister: [CoreMiddlewaresRegistry.validation(checkLoginOrRegister), authController.checkLoginOrRegister],
  login: [CoreMiddlewaresRegistry.validation(login), authController.login],
  logout: [CoreMiddlewaresRegistry.validation(postLogoutSchema), authController.logout],
  loginWithOtp: [CoreMiddlewaresRegistry.validation(postLoginWithOtp),authController.loginWithOtp],
  getIP: [
    CoreMiddlewaresRegistry.validation(getIpSchema),
    authController.getIP,
  ],
  loginWithUrl: [
    CoreMiddlewaresRegistry.validation(postLoginWithUrl),
    authController.loginWithUrl,
  ],
  clientLoginInformation: [
    CoreMiddlewaresRegistry.validation(getClientLoginInfo),
    authController.clientLoginInformation,
  ],
  refreshToken: [
    CoreMiddlewaresRegistry.validation(refreshTokenSchema),
    authController.refreshToken,
  ],
  sentOtp: [
    CoreMiddlewaresRegistry.validation(sentOtp),
    authController.sentOtp,
  ],
  postChangePassword : [CoreMiddlewaresRegistry.validation(postChangePassword),authController.postChangePassword,],
  postVerifyOtp : [CoreMiddlewaresRegistry.validation(postVerifyOtp),authController.postVerifyOtp]
};

exports.controllersRegistry = controllersRegistry;
