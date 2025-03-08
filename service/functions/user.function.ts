import { ApplicationContext, databaseActions, databaseProvider, WrappidLogger } from "@wrappid/service-core";
import sequelize, { Transaction } from "sequelize";
import constant from "../constants/constants";
import { IApiResponse } from "../types/auth.types";

/**
* Checks if a user exists in the system based on their identifier (email/phone).
* 
* @param {string} identifierType - Type of identifier to check ('email' or 'phone')
* @param {string} identifier - The actual email or phone number value
* 
* @returns {Promise<User|null>} A promise that resolves to:
*   - User object if found
*   - null if no user exists with the given identifier
* 
* @throws {Error} Propagates any database errors that occur during the query
* 
* @description
* This function performs the following operations:
* 1. Logs function entry
* 2. Queries the Users table with dynamic identifier field
* 3. Returns user data if found
* 4. Logs function exit
* 
* Database Operation:
* - Uses dynamic field selection based on identifierType
* - Performs a single record query (findOne)
* - Returns complete user record if found
* 
* Usage Notes:
* - Typically used in authentication flows
* - Can be used for duplicate user checks
* - Supports both email and phone lookups
* - Query is case-sensitive for email addresses
* 
* Logging:
* - Entry and exit points are logged
* - Any errors are logged before being propagated
*/
const checkUserExistance = async (identifierType:string, identifier:string, status:string)=>{
  try {
    WrappidLogger.logFunctionStart("checkUser");
    const data = await databaseActions.findOne("application", "Users", {
      where: {
        [identifierType]: identifier,
        _status: status
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
* Creates a new user in the system with associated person and contact information.
* 
* @param {string} identifierType - Type of identifier ('email' or 'phone')
* @param {string} identifier - The actual email or phone number value
* 
* @returns {Promise<IApiResponse>} A promise that resolves to:
*   - status: HTTP status code (201 for success, 500 for failure)
*   - resData: {
*       message: Success/failure message,
*       data: {
*         name: User's first name,
*         photoUrl: User's photo URL
*       }
*     }
* 
* @throws {Error} Propagates any errors that occur during user creation process
* 
* @description
* This function performs the following operations within a single transaction:
* 1. Logs function entry
* 2. Creates user record with provided identifier
* 3. Creates associated person record
* 4. Creates person contact record
* 5. Assigns default user role
* 6. Logs function exit
* 
* Database Operations:
* - All operations are wrapped in a transaction for data consistency
* - Creates records in multiple tables:
*   - Users: Basic user information
*   - Persons: Personal details
*   - PersonContacts: Contact information
*   - UserRoles: Role assignments
* 
* Role Assignment:
* - Uses configuration-defined default role
* - Falls back to ROLE_DEVELOPER if not configured
* - Map userID and roleID in UserRoles table
* 
* Security Features:
* - Transactional integrity
* - Structured role assignment
* - Status tracking for user roles
* 
* Note: This function creates a basic user record. Additional
* information like password, profile details etc. should be
* updated through separate functions.
*/
const createUser = async (identifierType:string, identifier: string):Promise<IApiResponse> => {
  try {
    WrappidLogger.logFunctionStart("createUser");
    let user = await databaseActions.findOne("application", "Users", {where:{ [identifierType]: identifier, 
      _status: {
        [sequelize.Op.or]: ['active', 'new']
      }
     }});
    
    if (!user) {
      await databaseProvider.application.sequelize.transaction(
        async (transaction: Transaction) => {
          user = await databaseActions.create("application", "Users", { [identifierType]: identifier, _status: constant.entityStatus.NEW }, { transaction });
          const personData = await databaseActions.create("application", "Persons", { userId: user.id, _status: constant.entityStatus.NEW }, { transaction });
          await databaseActions.create("application", "PersonContacts", {data: identifier, type: identifierType, personId: personData.id, _status: constant.entityStatus.NEW }, { transaction });
          const role = ApplicationContext.getContext("config").wrappid.defaultUserRole || constant.userRoles.ROLE_DEVELOPER;
          // Get the role id from the Roles table
          const roleData = await databaseActions.findOne("application", "Roles", {where: {role: role} }, { transaction });
          await databaseActions.create("application", "UserRoles", { roleID: roleData.id, userID: user.id, _status: constant.entityStatus.ACTIVE}, { transaction });
        });
    }

    if(!user){
      throw new Error("User not present. Please try again.");
    }

    return {
      status:201,
      resData:{
        message:"User created successfully",
        data:{
          "identifier": identifier,
          userID: user?.id
        }
      }
    };
  } catch (error: any) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("createUser");
  }
};



export {
  checkUserExistance,
  createUser
};
