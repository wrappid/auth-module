import {
  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";

import { GenericObject } from "@wrappid/service-core/types/generic.types";
import {
  clearValidatePhoneEmail,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
} from "./auth.helper.functions";
import { createUser } from "./user.functions";

/**
 * user ExistenceChecker function weather user exist 
 * @param emailOrPhone 
 * @returns 
 */
const userExistenceChecker = async (emailOrPhone: string) => {
  try {
    WrappidLogger.logFunctionStart("userExistenceChecker");
    const ob: GenericObject = clearValidatePhoneEmail(emailOrPhone);
    let whereOb: GenericObject = {};
    let responseObj: GenericObject = {};
    if (ob.type === COMMUNICATION_EMAIL) whereOb = { email: emailOrPhone };
    else if (ob.type === COMMUNICATION_SMS) whereOb = { phone: emailOrPhone };
    else {
      WrappidLogger.info("Not a valid email or phone");
      responseObj = { staus: 500, message: "Not a valid email or phone" };
    }
    const data = await databaseActions.findOne("ums", "Users", {
      where: whereOb,
    });

    if (data) {
      WrappidLogger.info("User found " + data.id);
      responseObj = { status: 200, message: "User found", data: data };
    } else {
      if (ob.valid) {
        const userBody = whereOb;
        responseObj = createUser(userBody);
        WrappidLogger.info("New User created");
      } else {
        console.error("Not a valid mail or phone:", emailOrPhone);
        responseObj = { status: 405, message: "Not valid phone or email" };
      }
    }
    return responseObj;
  } catch (err: any) {
    WrappidLogger.info("Error in check register " + err);
    throw err;
  }finally{
    WrappidLogger.logFunctionEnd("userExistenceChecker");
  }
};

export {
  userExistenceChecker
};
