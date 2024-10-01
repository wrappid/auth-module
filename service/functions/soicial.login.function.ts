import {
  ApplicationContext,
  coreConstant,
  databaseActions,
  databaseProvider,
  WrappidLogger,
} from "@wrappid/service-core";
import bcrypt from "bcrypt";
import constant from "../constants/constants";
import { genarateAccessToken } from "./auth.functions";

interface CheckUser {
  email: string;
  platformId: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

interface PlatformType {
  type: "x" | "facebook" | "linkidin"
}


/**
 * Check User or create user
 * @param userInfo
 * @returns
 */
const CheckuserFunc = async (userInfo: CheckUser) => {
  try {
    WrappidLogger.logFunctionStart("checkLoginOrRegisterUtil");
    // Get user data from db
    const data = await databaseActions.findOne("application", "Users", {
      where: userInfo.email,
    });
    if (data) {
      // user found
      WrappidLogger.info("User found " + data.id);
      const personData = await databaseActions.findOne(
        "application",
        "Persons",
        {
          where: {
            userId: data.id,
          },
        }
      );

      return {
        message: "User Found",
        data: {
          personId: personData.id,
          name:
            personData?.firstName +
            " " +
            personData?.middleName +
            " " +
            personData?.lastName,
          photoUrl: personData?.photoUrl,
          isVerified: personData?.isVerified,
        },
      };
    } else {
      // user not found so create here
      await databaseProvider.application.sequelize.transaction(
        async (transaction: any) => {
          // Get role
          const rolesData = await databaseActions.findOne(
            "application",
            "Roles",
            {
              where: {
                role:
                  ApplicationContext.getContext("config").wrappid
                    .defaultUserRole || constant.userRoles.ROLE_DEVELOPER,
              },
            }
          );
          // create user
          const userData = await databaseActions.create(
            "application",
            "Users",
            {
              email: userInfo.email,
              roleId: rolesData.id,
              firstLogin: true,
              _status: coreConstant.entityStatus.ACTIVE,
            },
            { transaction: transaction }
          );
          WrappidLogger.info("User Created " + userData.id);
          // create persondata         
          const personData = await databaseActions.create(
            "application",
            "Persons",
            {
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              middleName: userInfo.middleName,
              profileId: Date.now(),
              userId: userData.id,
              /**
               * @todo
               * added for phase 0.5
               */
              isVerified: true,
            },
            { transaction: transaction }
          );
          WrappidLogger.info("Person Created " + personData.id);

          return {
            message: "User Created",
            data: {
              personId: personData.id,
              name:
                personData?.firstName +
                " " +
                personData?.middleName +
                " " +
                personData?.lastName,
              photoUrl: personData?.photoUrl,
              isVerified: personData?.isVerified,
            },
          };
        }
      );
      WrappidLogger.info("New User created");
    }
  } catch (err: any) {
    WrappidLogger.info("Error in check register " + err);
    throw err;
  } finally {
    WrappidLogger.logFunctionEnd("checkLoginOrRegisterUtil");
  }
};

/**
 * In PersonContacts table add email with varified true
 * @param email 
 * @param personId 
 * @returns 
 */
const VerifyMailFunc = async (email: string, personId: number): Promise<boolean> => {
  try {
    WrappidLogger.logFunctionStart("VerifyMailFunc");
    const person = await databaseActions.create(
      "application",
      "PersonContacts",
      {
        data: email,
        type: coreConstant.contact.EMAIL,
        verfied: true,
        personId: personId,
        _status: coreConstant.entityStatus.ACTIVE,
      }
    );
    if(person){
      return true;
    }else{
      return false;
    }
  } catch (error: any) {
    WrappidLogger.info("Error in db update VerifyMailFunc");
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("VerifyMailFunc");
  }
};


/**
 * Add platform id to PersonContacts table
 * @param platformId 
 * @param personId 
 * @param platformType 
 * @returns 
 */
const platformIdAddFunc = async (platformId:string, personId:number, platformType: PlatformType)=> {
  try {
    WrappidLogger.logFunctionStart("VerifyMailFunc");
    const person = await databaseActions.create(
      "application",
      "PersonContacts",
      {
        data: platformId,
        type: platformType,
        verified:true,
        personId: personId,
        _status: coreConstant.entityStatus.ACTIVE,
      }
    );
    if(person){
      return true;
    }else{
      return false;
    }
  } catch (error: any) {
    WrappidLogger.info("Error in db update VerifyMailFunc");
    throw error;
  } finally {
    WrappidLogger.logFunctionEnd("VerifyMailFunc");
  }
};


/**
 * Login with password less
 * @param email 
 * @returns 
 */
const passwordLessLogin = async (email:number, deviceId:any) => {
  try {
    // const deviceId = await getDeviceId(req);
    const userDetails = await databaseActions.findOne("application", "Users", {
      where: {email: email},
    });

    const personData = await databaseActions.findOne("application", "Persons", {
      attributes: ["id", "userInvitationToken"],
      where: { userId: userDetails.id },
    });

    const userId = userDetails.id;
    const mail = userDetails.email;
    const phone = userDetails.phone;

    const { refreshToken, accessToken } = genarateAccessToken(
      userId,
      mail,
      phone,
      personData,
      userDetails
    );
    WrappidLogger.info("Tokens generate done");

    const sessions = await databaseActions.findAll(
      "application",
      "SessionManagers",
      {
        where: {
          userId: userId,
        },
      }
    );
    WrappidLogger.info("All sessions fetchd: " + sessions.length);
    let found = false;
    const result = await databaseProvider.application.sequelize.transaction(
      async (transaction: any) => {
        //check first time login
        if (userDetails.firstLogin) {
          WrappidLogger.info("First time login detected");
          await databaseActions.update("application", "Users", {firstLogin:false}, { where: { id: userId }});
        }

        for (let session = 0; session < sessions.length; session++) {
          const currSession = sessions[session];
          if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
            WrappidLogger.info("*****************************");
            WrappidLogger.info("session found " + currSession.id);
            WrappidLogger.info("*****************************");
            found = true;

            const [nrows] = await databaseActions.update(
              "application",
              "SessionManagers",
              { refreshToken: refreshToken },
              {
                where: {
                  id: currSession.id,
                },
                transaction: transaction,
              }
            );

            if (nrows > 0) {
              WrappidLogger.info("Login Success");
              // createLoginLogs(req.originalUrl, userId, req.body?.devInfo);
              return {
                message: "Successfully login",
                id: userId,
                personId: personData.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                sessionId: currSession.id,
              };
            } 
          }
        }
        if (!found) {
          const newSession = await databaseActions.create(
            "application",
            "SessionManagers",
            {
              refreshToken: refreshToken,
              userId: userId,
              deviceId: bcrypt.hashSync(deviceId, 9),
            },
            {
              transaction: transaction,
            }
          );
          WrappidLogger.info( "Login Success with New Device, session id: " + newSession.id);
          return {
            message: "Successfully login with New Device",
            id: userId,
            personId: personData.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            sessionId: newSession.id,
          };
        }
      }
    );
    return result;
  } catch (error:any) {
    WrappidLogger.info("Error in login: " + error);
    throw error;
  }
};

export { CheckuserFunc, VerifyMailFunc, platformIdAddFunc, passwordLessLogin };
