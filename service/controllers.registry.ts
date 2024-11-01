import { CoreMiddlewaresRegistry } from "@wrappid/service-core";
import * as authController from "./controllers/auth.controller";
import * as socialAuthController from "./controllers/social.auth.controller";
import { checkLoginSchema, loginWithOtpSchema, loginwithPasswordSchema, refreshTokenSchema, registerSchema } from "./validations/auth.validation";


const ControllersRegistry = {
  checkLogin: [CoreMiddlewaresRegistry.validation(checkLoginSchema), authController.checkLoginController],
  registerWithPassword: [CoreMiddlewaresRegistry.validation(registerSchema), authController.registerWithPasswordController],
  loginWithPassword: [CoreMiddlewaresRegistry.validation(loginwithPasswordSchema), authController.loginWithPasswordController],
  loginWithOtpp: [CoreMiddlewaresRegistry.validation(loginWithOtpSchema), authController.loginWithOtpController],
  resetPassword: [CoreMiddlewaresRegistry.validation(registerSchema), authController.resetPasswordController],
  urlLogin: [authController.urlLoginController],
  logout: [authController.logoutController],
  refreshTokenn: [CoreMiddlewaresRegistry.validation(refreshTokenSchema), authController.refreshTokenController],
  socialLogin: [ socialAuthController.socialLogin ]
};

export default ControllersRegistry;