const express = require("express");

const authController = require("../controllers/auth.controller");

const { checkLoginOrRegister,login,postLoginWithOtp,postLogoutSchema,getIpSchema,refreshTokenSchema,postLoginWithUrl,getClientLoginInfo } = require("../validations/auth.validation");
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");

const authRouter = express.Router();

authRouter.post(
  "/checkLoginOrRegister",
  CoreMiddlewaresRegistry.validation(checkLoginOrRegister),
  authController.checkLoginOrRegister
);

authRouter.post(
  "/login",
  CoreMiddlewaresRegistry.validation(login),
  authController.login
);

authRouter.post(
  "/loginWithOtp",
  CoreMiddlewaresRegistry.validation(postLoginWithOtp),
  authController.loginWithOtp
);

authRouter.post(
  "/loginWithUrl",
  CoreMiddlewaresRegistry.validation(postLoginWithUrl),
  authController.loginWithUrl
);

authRouter.post(
  "/logout",
  CoreMiddlewaresRegistry.validation(postLogoutSchema),
  authController.logout
);


authRouter.get(
  "/getIP",
  CoreMiddlewaresRegistry.validation(getIpSchema),
  authController.getIP
);


authRouter.post(
  "/refreshToken",
  CoreMiddlewaresRegistry.validation(refreshTokenSchema),
  authController.refreshToken
);



authRouter.get(
  "/clientLoginInformation",
  CoreMiddlewaresRegistry.validation(getClientLoginInfo),
  authController.clientLoginInformation
);



module.exports = authRouter;
