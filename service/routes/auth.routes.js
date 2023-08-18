const express = require("express");

const authController = require("../controllers/auth.controller");

const { checkLoginOrRegister } = require("../validations/auth.validation");
const { CoreMiddlewaresRegistry } = require("@wrappid/service-core");

const authRouter = express.Router();

authRouter.post(
  "/checkLoginOrRegister",
  CoreMiddlewaresRegistry.validation(checkLoginOrRegister),
  authController.checkLoginOrRegister
);

module.exports = authRouter;
