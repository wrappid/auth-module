const authController = require("./controllers/auth.controller");
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");
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
} = require("./validations/auth.validation");

const controllersRegistry = {
  checkLoginOrRegister: [
    CoreMiddlewaresRegistry.validation(checkLoginOrRegister),
    authController.checkLoginOrRegister,
  ],
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
};

exports.controllersRegistry = controllersRegistry;
