import { CoreMiddlewaresRegistry } from "@wrappid/service-core";

import * as authController from "./controllers/auth.controller";

import {
  checkLoginOrRegister,
  login,
  postLoginWithOtp,
  postLogoutSchema,
  getIpSchema,
  refreshTokenSchema,
  postLoginWithUrl,
  // getClientLoginInfo,
  sentOtp,
  postChangePassword,
  postVerifyOtp,
} from "./validations/auth.validation";

const ControllersRegistry = {
  checkLoginOrRegister: [
    CoreMiddlewaresRegistry.validation(checkLoginOrRegister),
    authController.checkLoginOrRegister,
  ],
  login: [CoreMiddlewaresRegistry.validation(login), authController.login],
  logout: [
    CoreMiddlewaresRegistry.validation(postLogoutSchema),
    authController.logout,
  ],
  loginWithOtp: [
    CoreMiddlewaresRegistry.validation(postLoginWithOtp),
    authController.loginWithOtp,
  ],
  getIP: [
    CoreMiddlewaresRegistry.validation(getIpSchema),
    authController.getIP,
  ],
  loginWithUrl: [
    CoreMiddlewaresRegistry.validation(postLoginWithUrl),
    authController.loginWithUrl,
  ],
  clientLoginInformation: [
    authController.clientLoginInformation
  ],
  refreshToken: [
    CoreMiddlewaresRegistry.validation(refreshTokenSchema),
    authController.refreshToken,
  ],
  sentOtp: [
    CoreMiddlewaresRegistry.validation(sentOtp),
    authController.sentOtp,
  ],
  postChangePassword: [
    CoreMiddlewaresRegistry.validation(postChangePassword),
    authController.postChangePassword,
  ],
  postVerifyOtp: [
    CoreMiddlewaresRegistry.validation(postVerifyOtp),
    authController.postVerifyOtp,
  ],
};

export default ControllersRegistry;
