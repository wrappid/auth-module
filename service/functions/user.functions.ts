import { coreConstant, databaseActions, databaseProvider, WrappidLogger } from "@wrappid/service-core";
import { GenericObject } from "@wrappid/service-core/types/generic.types";
import Sequelize from "sequelize";
import { ulid } from "ulid";
import constant from "../constants/constants";


/**
 * Create new User
 */
export   const createUser = async (userBody: GenericObject, emailOrPhone:string, ob: GenericObject) => {
  try {
    let responseObj: GenericObject  = {};
    console.log(databaseProvider);
    await databaseProvider.ums.sequelize.transaction(
      async (transaction: Sequelize.Transaction) => {
        const userData = await databaseActions.create(
          "ums",
          "Users",{
            ...userBody,
            uid: ulid(),
            status: constant.entityStatus.ACTIVE
          },
          { transaction: transaction }
        );
        // const role = ApplicationContext.getContext("config").wrappid.defaultUserRole || constant.userRoles.ROLE_DEVELOPER;
        userData.assignRole(userData.id, "admin");
        WrappidLogger.info("User Created " + userData.id);
        const personData = await databaseActions.create( 
          "ums",
          "Persons",{
            ...userBody,
            uid:ulid(),
            userID: userData.id,
            status: constant.entityStatus.ACTIVE,
            /**
             * @todo
             * added for phase 0.5
             */
            // isVerified: true,
          },
          { transaction: transaction }
        );
        WrappidLogger.info("Person Created " + personData.id);


        const personContacts = await databaseActions.create(
          "application",
          "PersonContacts",{
            data: emailOrPhone,
            type:
              ob.type === coreConstant.commType.EMAIL
                ? coreConstant.contact.EMAIL
                : coreConstant.contact.PHONE,
            personId: personData.id,
            _status: coreConstant.entityStatus.ACTIVE,
          },
          { transaction: transaction }
        );
        WrappidLogger.info("Person contact Created " + personContacts.id);
        responseObj = { status: 201, message: "New User created" };
      }
    );
    return responseObj;
  } catch (error:any) {
    WrappidLogger.error(error);
    throw error;
  }
};