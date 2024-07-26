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
  test: [authController.testDatabase]
};

export default ControllersRegistry;
