import { CoreMiddlewaresRegistry } from "@wrappid/service-core";

import * as authController from "./controllers/auth.controller";

import {
  CheckUserExist,
} from "./validations/auth.validation";

const ControllersRegistry = {
  CheckUserExist: [
    CoreMiddlewaresRegistry.validation(CheckUserExist),
    authController.CheckUserExist
  ],
  loginwithPassword: [authController.loginWithPassword],
  loginwithotp: [authController.loginWithOTP],
  resetPassword: [authController.resetPassword],
  changePassword: [authController.changePassword],
  accessToken: [authController.accessToken],
  newRefreshToken: [authController.refreshToken],
  logout: [authController.logout],
  sentOtp: [authController.sentOtp],
  register: [authController.register],
  googleLogin: [authController.googleLogin],
  googleCallback: [authController.googleCallback],
  goglelogout: [authController.goglelogout],
};

export default ControllersRegistry;
