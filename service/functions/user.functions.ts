import { databaseActions, databaseProvider, WrappidLogger } from "@wrappid/service-core";
import { GenericObject } from "@wrappid/service-core/types/generic.types";
import Sequelize from "sequelize";
import { ulid } from "ulid";


/**
 * Create new User
 */
export   const createUser = async (userBody: GenericObject) => {
  try {
    let responseObj: GenericObject  = {};
    console.log(databaseProvider);
    await databaseProvider.ums.sequelize.transaction(
      async (t: Sequelize.Transaction) => {
        const userData = await databaseActions.create(
          "ums",
          "Users",{
            ...userBody,
          },
          { transaction: t }
        );
        userData.assignRole(userData.id, "admin");
        WrappidLogger.info("User Created " + userData.id);
        const personData = await databaseActions.create( 
          "ums",
          "Persons",{
            ...userBody,
            uid:ulid(),
            userID: userData.id,
            /**
             * @todo
             * added for phase 0.5
             */
            isVerified: true,
          },
          { transaction: t }
        );
        WrappidLogger.info("Person Created " + personData.id);

        responseObj = { status: 201, message: "New User created" };
      }
    );
    return responseObj;
  } catch (error:any) {
    WrappidLogger.error(error);
    throw error;
  }
};