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

export { socialLoginFunc };
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
    const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: platformToken,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    const data: any = await response.json();
    const token = data.access_token;

    const userResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }
    const rawData: any = await userResponse.json();
    const nameParts = rawData.name.trim().split(" ");
    let firstName = "", middleName = "", lastName = "";

    // Assign the parts of the name accordingly
    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      middleName = nameParts.slice(1, -1).join(" "); // Everything in the middle
      lastName = nameParts[nameParts.length - 1];
    }
    const userData = {
      firstName: firstName || "",
      middleName: middleName || "", // Default to empty string if middleName is null
      lastName: lastName || "",
      platformId: rawData.sub,
      email: rawData.email,
    };
    return userData;
  } catch (error: any) {
    WrappidLogger.info("Error in LinkedInLogin: " + error);
    throw error;
  }
}

function githubLogin(
  platformToken: string
): CheckUser | PromiseLike<CheckUser> {
  WrappidLogger.info("DB TOKEN: " + platformToken);
  throw new Error("Function not implemented.");
}
