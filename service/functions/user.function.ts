import { ApplicationContext, databaseActions, databaseProvider, WrappidLogger } from "@wrappid/service-core";
import { Transaction } from "sequelize";
import constant from "../constants/constants";
import { IApiResponse } from "../types/auth.types";

/**
 * This function is used to check if the user exists in the database
 * @param identifier  email or phone number of the user
 * @returns
 */   
const checkUserExistance = async (identifierType:string, identifier:string)=>{
  try {
    WrappidLogger.logFunctionStart("checkUser");
    const data = await databaseActions.findOne("application", "Users", {
      where: {
        [identifierType]: identifier
      }
    });
    return data;
  } catch (error:any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("checkUser");
  }
};

/**
 * This function is used to create a new user in the database
 * @param identifier  email or phone number of the user
 * @returns
 */
const createUser = async (identifierType:string, identifier: string):Promise<IApiResponse> => {
  try {
    WrappidLogger.logFunctionStart("createUser");
    let returnData:IApiResponse = {
      status: 500,
      resData: {
        message: "",
        data: {
          name: "",
          photoUrl: ""
        }
      }
    };
    await databaseProvider.application.sequelize.transaction(
      async (transaction: Transaction) => {
        const useradta = await databaseActions.create("application", "Users", { [identifierType]: identifier}, { transaction });
        const personData = await databaseActions.create("application", "Persons", { userId: useradta.id }, { transaction });
        await databaseActions.create("application", "PersonContacts", {data: identifier, personId: personData.id }, { transaction });
        const role = ApplicationContext.getContext("config").wrappid.defaultUserRole || constant.userRoles.ROLE_DEVELOPER;
        // Get the role id from the Roles table
        const roleData = await databaseActions.findOne("application", "Roles", {where: {role: role} }, { transaction });
        await databaseActions.create("application", "UserRoles", { roleID: roleData.id, userID: useradta.id, _status: constant.entityStatus.ACTIVE}, { transaction });
        returnData = {
          status:201,
          resData:{
            message:"User created successfully",
            data:{
              name: personData.firstName,
              photoUrl: personData.photoUrl
            }
          }
        };
      });
    return returnData;
  } catch (error: any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("createUser");
  }
};



export{
  checkUserExistance,
  createUser,
};