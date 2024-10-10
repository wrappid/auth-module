/* eslint-disable import/no-unresolved */
import {
  ApplicationContext,
  coreConstant,
  databaseActions,
  databaseProvider,
  WrappidLogger,
} from "@wrappid/service-core";
// eslint-disable-next-line import/no-unresolved
import bcrypt from "bcrypt";
import fetch from "node-fetch-commonjs";
import constant from "../constants/constants";
import { genarateAccessToken } from "./auth.functions";

import * as linkedIn from "./linkedIn.function";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CheckUser {
  email: string;
  platformId: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  photoUrl?: string;
}

/**
 * Social login
 * @param platform
 * @param accessToken
 * @param deviceId
 * @returns
 */
async function socialLoginFunc(
  platform: string,
  platformToken: string,
  deviceId: string
) {
  try {
    let userData: CheckUser = { email: "", platformId: "" };
    switch (platform) {
      case constant.platformType.FACEBOOK:
        userData = await facebookLogin(platformToken);
        break;
      case constant.platformType.LINKEDIN:
        userData = await linkedinLogin(platformToken);
        break;

      case constant.platformType.GITHUB:
        userData = await githubLogin(platformToken);
        break;
      default:
        break;
    }

    // check or create user
    await checkuserFunc(platform, userData);
    // Login without password
    const loginResult = await passwordLessLogin(userData.email, deviceId);
    return { status: 200, ...loginResult };
  } catch (err: any) {
    WrappidLogger.error("Error in socialLoginFunc " + err.message);
    throw err;
  }
}

/**
 * Check User or create user
 * @param platform
 * @param userInfo
 * @returns
 */
const checkuserFunc = async (platform: string, userInfo: CheckUser) => {
  try {
    WrappidLogger.logFunctionStart("checkuserFunc");
    const checkValidEmail = emailRegex.test(userInfo.email);
    if (!checkValidEmail) {
      throw Error("Not a valid email");
    }
    // Get user data from db
    const data = await databaseActions.findOne("application", "Users", {
      where: { email: userInfo.email },
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
      let personData: any;
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
          WrappidLogger.info("User Created" + userData.id);
          // create persondata
          personData = await databaseActions.create(
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
        }
      );
      //update personcontacts with mail
      await databaseActions.create("application", "PersonContacts", {
        data: userInfo.email,
        type: coreConstant.contact.EMAIL,
        verfied: true,
        personId: personData.id,
        _status: coreConstant.entityStatus.ACTIVE,
      });
      //update personcontacts with platformId
      await databaseActions.create("application", "PersonContacts", {
        data: userInfo.platformId,
        type: platform,
        verified: true,
        personId: personData.id,
        _status: coreConstant.entityStatus.ACTIVE,
      });
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
  } catch (err: any) {
    WrappidLogger.info("Error in check register " + err);
    throw err;
  } finally {
    WrappidLogger.logFunctionEnd("checkLoginOrRegisterUtil");
  }
};

/**
 * Login with password less
 * @param email
 * @returns
 */
const passwordLessLogin = async (email: string, deviceId: any) => {
  try {
    const userDetails = await databaseActions.findOne("application", "Users", {
      where: { email: email },
    });

    const personData = await databaseActions.findOne("application", "Persons", {
      attributes: ["id", "userInvitationToken"],
      where: { userId: userDetails.id },
    });

    const userId = userDetails.id;
    const mail = userDetails.email;
    const phone = userDetails?.phone;

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
          await databaseActions.update(
            "application",
            "Users",
            { firstLogin: false },
            { where: { id: userId } }
          );
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
                status: 200,
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
          WrappidLogger.info(
            "Login Success with New Device, session id: " + newSession.id
          );
          return {
            status: 200,
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
  } catch (error: any) {
    WrappidLogger.info("Error in login: " + error);
    throw error;
  }
};

/**
 * Login with facebook
 * @param accessToken
 * @param deviceId
 * @param platform
 * @returns
 */
const facebookLogin = async (accessToken: string) => {
  try {
    // Get user details from facebook graph API
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=email,first_name,middle_name,last_name,id&access_token=${accessToken}`
    );
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }

    const rawData: any = await userResponse.json();
    const userData = {
      firstName: rawData.first_name || "",
      middleName: rawData.middle_name || "", // Default to empty string if middleName is null
      lastName: rawData.last_name || "",
      platformId: rawData.id,
      email: rawData.email,
    };
    return userData;
  } catch (error: any) {
    WrappidLogger.info("Error in facebookLogin: " + error);
    throw error;
  }
};


async function linkedinLogin(platformToken: string): Promise<CheckUser> {
  try {
    // Get Access Token from LinkedIn API
    const clientId =
      ApplicationContext.getContext("config")?.socialLogin?.linkedin?.apiKey;
    const clientSecret =
      ApplicationContext.getContext("config")?.socialLogin?.linkedin
        ?.apiKeySecret;
    const redirectUri =
      ApplicationContext.getContext("config")?.socialLogin?.linkedin
        ?.callbackURL;
    const token = await linkedIn.getAccessToken(platformToken,clientId,clientSecret,redirectUri);
    const userDetails = await linkedIn.getUserDetails(token);    
    return userDetails;
  } catch (error: any) {
    WrappidLogger.error("Error in LinkedInLogin: " + error);
    throw error;
  }
}


async function githubLogin(platformToken:string): Promise<CheckUser>{
  //
  try {
    const code  = platformToken;
    if (!code) { throw new Error("Dint recived github code from the user");}

    const client_id = ApplicationContext.getContext("config").socialLogin.github.client_id; // Replace with your GitHub client_id
    const client_secret = ApplicationContext.getContext("config").socialLogin.github.client_secret; // Replace with your GitHub client_secret

    if (client_id == undefined  || client_secret == undefined) {throw new Error("unable to get the client_id client_secret");}
    const bodyData = { client_id, client_secret, code };

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData)
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user data: ${response.statusText}`
      );
    }

    const data:any = await response.json();
    console.log(data, "data from github");
    const accessToken =data?.access_token; 
    if (!accessToken) {
      throw new Error(
        "Failed to get the accessToken from github"
      );
    }

    ApplicationContext.setContext("githubAccessToken", accessToken);    // store this in the database for future use
    
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + ApplicationContext.getContext("githubAccessToken"),
      }});

    if (!userResponse.ok) {
      throw new Error(
        `Failed to fetch user data: ${userResponse.statusText}`
      );
    }


    const rawData:any = await userResponse.json();
    const nameArray = rawData.name?.split(" ");//name in the array format [firstName, middleName, lastName]
    const userData = {
      firstName: nameArray[0] || "",
      middleName: nameArray[1] || "", // Default to empty string if middleName is null
      lastName: nameArray[2]  || "",
      platformId: rawData.id,
      email: rawData.email
    };
    console.log(userData, "userData from github");
    return userData;

  }
  catch (error:any) {
    WrappidLogger.error("Error in GithubLogin: " + error);
    throw error;
  } 
  finally{
    WrappidLogger.logFunctionEnd("githubLogin");
  }
}
  

export { socialLoginFunc };