const {
  communicate,
  configProvider,
  coreConstant,
  databaseActions,
  databaseProvider,
} = require("@wrappid/service-core");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DeviceDetector = require("node-device-detector");
const otpGenerator = require("otp-generator");


const {
  accessTokenSecret,
  refreshAccessTokenSecret,
  expTime,
  expTimeRefreshToken,
} = configProvider.jwt;

const {
  clearValidatePhoneEmail,
  getDeviceId,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
} = require("./auth.helper.functions");

/**
 *
 * @returns
 */
const checkLoginOrRegisterUtil = async (req) => {
  try {
    // let iWsValidJOI = await authenticateJOI(req,"checkLoginOrRegisterPOST",["body","query"])
    let emailOrPhone = req.body.emailOrPhone;
    let ob = clearValidatePhoneEmail(emailOrPhone);
    let whereOb = {};
    if (ob.type === COMMUNICATION_EMAIL) whereOb = { email: emailOrPhone };
    else if (ob.type === COMMUNICATION_SMS) whereOb = { phone: emailOrPhone };
    else {
      console.log("Not a valid email or phone");
      return { staus: 500, message: "Not a valid email or phone" };
    }

    let data = await databaseActions.findOne("application", "Users", {
      where: whereOb,
    });

    if (data) {
      if (data.firstLogin) {
        console.log("User found, first time login", data.id);
        return { status: 201, message: "First login for created user" };
      } else {
        console.log("User found", data.id);
        let personData = await databaseActions.findOne(
          "application",
          "Persons",
          {
            where: {
              userId: data.id,
            },
          }
        );

        return {
          status: 200,
          message: "User Found",
          data: {
            name:
              personData.firstName +
              " " +
              personData.middleName +
              " " +
              personData.lastName,
            photoUrl: personData.photoUrl,
            isVerified: personData.isVerified,
          },
        };
      }
    } else {
      if (ob.valid) {
        let userBody = whereOb;
        const result = await databaseProvider.application.sequelize.transaction(
          async (t) => {
            //Changed
            let rolesData = await databaseActions.findOne(
              "application",
              "Roles",
              {
                where: { role: "doctor" },
              }
            );
            let userData = await databaseActions.create(
              "application",
              "Users",
              {
                ...userBody,
                roleId: rolesData.id,
                firstLogin: true,
              },
              { transaction: t }
            );
            console.log("User Created", userData.id);

            let personData = await databaseActions.create(
              "application",
              "Persons",
              {
                ...userBody,
                profileId: Date.now(),
                userId: userData.id,
                /**
                 * @todo
                 * added for phase 0.5
                 */
                isVerified: true,
              },
              { transaction: t }
            );
            console.log("Person Created", personData.id);

            let person = await databaseActions.create(
              "application",
              "PersonContacts",
              {
                data: emailOrPhone,
                type:
                  ob.type === coreConstant.commType.EMAIL
                    ? coreConstant.contact.EMAIL
                    : coreConstant.contact.PHONE,
                personId: personData.id,
                _status: coreConstant.entityStatus.ACTIVE,
              },
              { transaction: t }
            );
            console.log("Person contact Created", person.id);

            return { status: 201, message: "New User created" };
          }
        );
        console.log("New User created");
        return result;
      } else {
        console.error("Not a valid mail or phone:", emailOrPhone);
        return { status: 405, message: "Not valid phone or email" };
      }
    }
  } catch (err) {
    console.log("Error in check register", err);
    throw err;
  }
};

const loginHelper = async (req, otherLogin) => {
  try {
    let otpLogin = false;
    let urlLogin = false;
    let emailOrPhone = req.body.emailOrPhone;
    let ob = clearValidatePhoneEmail(req.body.emailOrPhone);
    let whereOb = {};
    let resetPassword = false;
    let updatePassword = false;
    let verificationOb = {};

    if (otherLogin?.otpLogin) {
      otpLogin = true;
    } else if (otherLogin?.urlLogin) {
      urlLogin = true;
    }
    if (ob.type == COMMUNICATION_EMAIL) {
      whereOb = { email: emailOrPhone };
      verificationOb = { emailVerified: true };
    } else if (ob.type == COMMUNICATION_SMS) {
      verificationOb = { phoneVerified: true };

      whereOb = { phone: emailOrPhone };
    } else {
      console.log("Not a valid email or phone");
      return { status: 500, message: "Not a valid email or phone" };
    }

    //check if it is a reset password request
    if (req.query.reset) {
      console.log("Login with password reset mode");
      if (req.query.reset === "true") {
        resetPassword = true;
      } else {
        console.log("*********************************");
        console.log("RESET NOT IN CORRECT FORMAT");
        console.log("*********************************");
        return { status: 401, message: "Reset not in correct format" };
      }
    }

    let userDetails = await databaseActions.findOne("application", "Users", {
      where: whereOb,
    });

    if (!userDetails) {
      console.log("User does not exist");
      return { status: 400, message: "User does not exist" };
    } else if (!userDetails.isActive) {
      console.error("User not active");
      return { status: 401, message: "User not active...Contact admin" };
    } else {
      let userId = userDetails.id;
      let mail = userDetails.email;
      let phone = userDetails.phone;
      let userUpdateOb = {};

      // console.log("i am in >>>>>>>>>>>>>>>>>>>>>>>>>>>",userId)
      let personData = await databaseActions.findOne("application", "Persons", {
        attributes: ["id", "userInvitationToken"],
        where: { userId: userId },
      });
      let personId = personData.id;
      console.log("Person details fetched");

      if (otpLogin) {
        let otpCheck = await checkOtp(userId, req.body.otp);
        if (!otpCheck) {
          console.log("OTP match fail");
          return { status: 500, message: "OTP does not match" };
        } else {
          console.log("OTP match passed");
          await databaseActions.update("application", "Otps", { _status: coreConstant.entityStatus.INACTIVE }, {
            where: {
              userId: userId,
              otp: req.body.otp
            }
          });
          if (resetPassword) {
            let passwordValid = resetPasswordCheck(
              req.body.password,
              userDetails
            );
            if (passwordValid?.success) {
              updatePassword = true;
              userUpdateOb["password"] = passwordValid.password;
            } else {
              return {
                status: 500,
                message: passwordValid.message,
              };
            }
          }
        }
      } else if (urlLogin) {
        let check = checkUrlLoginValidation(req, personData);
        if (check) {
          console.log("Validation done");
        } else {
          console.log("Validation failed");
          return { status: 401, message: "Invalid url token" };
        }
      } else if (!checkPassword(req.body.password, userDetails.password)) {
        console.error("Invalid password");
        return { status: 401, message: "Invalid password" };
      }

      let deviceId = await getDeviceId(req);
      console.log("Device id fetched");

      let { refreshToken, accessToken } = genarateAccessToken(
        userId,
        mail,
        phone,
        personData,
        userDetails
      );
      console.log("Tokens generate done");

      let sessions = await databaseActions.findAll(
        "application",
        "SessionManagers",
        {
          where: {
            userId: userId,
          },
        }
      );

      console.log("All sessions fetchd:", sessions.length);

      let found = false;

      const result = await databaseProvider.application.sequelize.transaction(
        async (t) => {
          //check first time login
          if (userDetails.firstLogin) {
            console.log("First time login detected");
            userUpdateOb["firstLogin"] = false;
          }

          if (userDetails.firstLogin || updatePassword) {
            let [checkUser] = await databaseActions.update(
              "application",
              "Users",
              {
                ...userUpdateOb
              },
              {
                where: {
                  id: userId,
                },
              },
              {
                transaction: t
              }
            );
            if (checkUser == 0) {
              throw "DB update error";
            } else {
              console.log("First time login updated");
            }
          }

          //for otplogin update personContact verfication status
          if (otpLogin || urlLogin) {
            console.log("PersonContacts updating due to otplogin or urllogin");

            let [checkContacts] = await databaseActions.update(
              "application",
              "PersonContacts",

              {
                verified: true,
              },
              {
                where: {
                  personId: personId,
                  data: emailOrPhone,
                },
                transaction: t,
              }
            );

            if (checkContacts == 0) {
              console.error(
                "Person contact update not made, user id:",
                userId,
                ", contact:",
                emailOrPhone
              );
              throw "DB update error";
            } else {
              console.log("PersonContacts updated");
            }
          }

          //user emailphone verified status change
          if (
            userDetails.firstLogin ||
            (verificationOb.emailVerified && !personData.emailVerified) ||
            (verificationOb.phoneVerified && !personData.phoneVerified)
          ) {
            console.log("Persons table updating:", verificationOb);
            if (urlLogin) {
              verificationOb["userInvitationToken"] = null;
            }

            let [checkPerson] = await databaseActions.update(
              "application",
              "Persons",

              verificationOb,
              {
                where: {
                  userId: userId,
                },
                transaction: t,
              }
            );
            if (checkPerson == 0) {
              throw "DB update error";
            } else {
              console.log("Persons table updated");
            }
          }

          for (let session = 0; session < sessions.length; session++) {
            let currSession = sessions[session];
            if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
              console.log("*****************************");
              console.log("session found", currSession.id);
              console.log("*****************************");
              found = true;

              let [nrows] = await databaseActions.update(
                "application",
                "SessionManagers",

                { refreshToken: refreshToken },
                {
                  where: {
                    id: currSession.id,
                  },
                  transaction: t,
                }
              );

              if (nrows > 0) {
                console.log("Login Success");
                // get person id
                let person = await databaseActions.findOne("application", "Persons", {
                  where: {
                    "userId": userId
                  }
                });
                createLoginLogs(req.originalUrl, userId, req.body?.devInfo);
                return {
                  status: 200,
                  message: "Successfully login",
                  id: userId,
                  personId: person.id,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  sessionId: currSession.id,
                };
              } else {
                console.error("Can not save refresh token", nrows);
                return { status: 500, message: "Database error" };
              }
            }
          }

          if (!found) {
            let newSession = await databaseActions.create(
              "application",
              "SessionManagers",

              {
                refreshToken: refreshToken,
                userId: userId,
                deviceId: bcrypt.hashSync(deviceId, 9),
              },
              {
                transaction: t,
              }
            );
            console.log(
              "Login Success with New Device, session id: ",
              newSession.id
            );
            createLoginLogs(req.originalUrl, userId, req.body?.devInfo);

            // get person id
            let person = await databaseActions.findOne("application", "Persons", {
              where: {
                "userId": userId
              }
            });

            return {
              status: 200,
              message: "Successfully login with New Device",
              id: userId,
              personId: person.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              sessionId: newSession.id,
            };
          }
        }
      );

      return result;
    }
  } catch (err) {
    console.log("Error in login", err);
    throw err;
  }
};

const logoutHelper = async (req, res) => {
  try {
    console.error("user:: ", req.user);
    let deviceId = await getDeviceId(req);
    let sessions = await databaseActions.findAll("application", "SessionManagers", {
      where: {
        userId: 1, //hard data
      },
    });
    for (let session = 0; session < sessions.length; session++) {
      let currSession = sessions[session];
      if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
        let [nrows] = await databaseActions.update(
          "application",
          "SessionManagers",
          { refreshToken: "" },
          {
            where: {
              id: currSession.id,
            },
          }
        );
        if (nrows > 0) {
          console.log("Successfully logged out");
          res.status(200).json({ message: "Successfully logged out" });
        } else {
          console.error("Database error in logout");
          res.status(500).json({ message: "Database error" });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Database error in logout", err);
    throw err;
  }
};

async function checkOtp(userId, otp) {
  let dbOtp = await databaseActions.findOne("application", "Otps", {
    where: {
      userId: userId,
      _status: coreConstant.entityStatus.ACTIVE,
    },
  });
  // console.log("DB OTP:", dbOtp.otp, Number(dbOtp.otp));
  // console.log("REQ OTP:", otp, Number(otp));
  // console.log("CHECK", Number(dbOtp.otp) === Number(otp));

  if (Number(dbOtp.otp) === Number(otp)) {
    return true;
  } else {
    return false;
  }
}

function resetPasswordCheck(password, userDetails) {
  let samePasswordCheck = checkPassword(password, userDetails.password);

  if (samePasswordCheck) {
    console.log("Password can not be same as previous password");
    return {
      success: false,
      message: "Password can not be same as previous password",
    };
  } else
    return {
      success: true,
      password: bcrypt.hashSync(password, 9),
      message: "Password reset can be done",
    };
}

function checkUrlLoginValidation(req, personData) {
  console.log(
    "DB TOKEN: ",
    personData,
    "req token: ",
    req.body.userInvitationToken
  );
  if (personData.userInvitationToken === req.body.userInvitationToken) {
    console.log("Url login token vvalidation succssfull");
    return true;
  } else {
    console.log("Url login token vvalidation failed");
    return false;
  }
}

function checkPassword(reqPassword, dbPassword) {
  return bcrypt.compareSync(reqPassword, dbPassword);
}

function genarateAccessToken(userId, mail, phone, personData, userDetails) {
  const accessToken = jwt.sign(
    {
      userId: userId,
      email: mail,
      phone: phone,
      personId: personData?.id,
      roleId: userDetails.roleId,
    },
    accessTokenSecret,
    { expiresIn: expTime }
  );
  const refreshToken = jwt.sign(
    {
      userId: userId,
      email: mail,
      phone: phone,
      personId: personData?.id,
      roleId: userDetails.roleId,
    },
    refreshAccessTokenSecret,
    { expiresIn: expTimeRefreshToken }
  );
  console.log("Tokens generated");
  return { accessToken, refreshToken };
}

async function createLoginLogs(path, userId, extraInfo = "{}") {
  console.log("Login logs created", userId, path);
  await databaseActions.create("application", "LoginLogs", {
    userId: userId,
    route: path,
    message: "Login Success",
    status: 200,
    extraInfo: JSON.parse(extraInfo),
  });
}
const getIPHelper = async (req, res) => {
  try {
    console.log(res);
    let detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: true,
    });
    detector.detect(req.headers["user-agent"]);
    let devId = await getDeviceId(req);
    req.devId = devId;
    return { status: 200, devId: devId };
  } catch (err) {
    console.error("internal error", err);
    throw err;
  }
};

const refreshTokenHelper = async (req, res) => {
  try {
    jwt.verify(
      req.body.refreshToken,
      refreshAccessTokenSecret,
      async (err, user) => {
        if (err) {
          console.error("Refresh token expired", err);
          return res.status(401).json({ message: "Refresh token expired" });
        }
        let userId = user.userId;
        // let isValidJOI = await authenticateJOI(req,"refreshtokenPOST",["body"])
        // if(isValidJOI.validFlag){
        let deviceId = await getDeviceId(req);
        let sessions = await databaseActions.findAll(
          "application",
          "SessionManagers",
          {
            where: {
              userId: userId,
              // deviceId: deviceId
            },
          }
        );
        console.log("Sessions available:", sessions.length);
        for (let session = 0; session < sessions.length; session++) {
          let currSession = sessions[session];
          if (bcrypt.compareSync(deviceId, currSession.deviceId)) {
            const token = req.body.refreshToken;
            const refreshToken = currSession.refreshToken;
            console.log("Session:", currSession.id);
            if (!token) {
              return res.status(401).json({ message: "Invalid request" });
            }
            if (refreshToken != token) {
              console.error("Wrong refresh token");
              return res.status(401).json({ message: "unauthorised access" });
            }

            let userDetails = await databaseActions.findOne(
              "application",
              "Users",
              {
                where: {
                  id: userId,
                },
              }
            );
            const accessToken = jwt.sign(
              {
                userId: userDetails.id,
                email: userDetails.email,
                phone: userDetails.phone,
                roleId: userDetails.roleId,
              },
              accessTokenSecret,
              { expiresIn: expTime }
            );
            console.log("Access token refreshed");
            return res.status(200).json({
              accessToken: accessToken,
            });
          }
        }
        console.log("session not found");
        return res.status(401).json({
          message: "session not found",
        });
      }
    );
  } catch (err) {
    console.error("Database error in refresh token", err);
    throw err;
  }
};

const clientLoginInformationHelper = async (req, res) => {
  try {
    console.log(res);
    let userID = req.body.userId;

    // ip
    let ip = req?.socket?.remoteAddress || req?.ip || "Not found";

    // last login info
    const lastLoginDetails = await databaseActions.findOne(
      "application",
      "LoginLogs",
      {
        where: { userId: userID },
        order: [["createdAt", "DESC"]],
      }
    );

    // device info
    const deviceInfo = await databaseActions.findOne(
      "application",
      "SessionManagers",
      {
        where: { userId: userID },
        order: [["createdAt", "DESC"]],
      }
    );
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);
    // console.log('result parse', result);
    return { status: 200, deviceInfo: deviceInfo, ip: ip, lastLoginDetails: lastLoginDetails, result: result, userAgent: userAgent };
    // .status(200)
    // .json({ deviceInfo, ip, lastLoginDetails, result, userAgent });
  } catch (err) {
    console.log("Error : ", err);
    throw err;
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const sentOtp = async (req, res) => {
  try {
    console.log(res);
    let commData = {};
    let userId = req?.user?.userId;
    let emailOrPhone = req.body.data;
    let commType = req.body.type;
    if (!commType) {
      let { type } = clearValidatePhoneEmail(emailOrPhone);
      commType = type;
    }
    let templateID = req.body.templateID;
    if (!userId) {
      let user = await databaseActions.findOne("application", "Users", {
        where:
          commType === COMMUNICATION_EMAIL
            ? {
              email: req.body.data,
            }
            : {
              phone: req.body.data,
            },
      });
      userId = user?.id;
      commData.id = user?.id;
    }

    let contactType = commType === coreConstant.commType.SMS ? coreConstant.contact.PHONE : commType;
    const personContact = await databaseActions.findOne(
      "application",
      "PersonContacts",
      {
        where: { data: emailOrPhone, type: contactType },
      }
    );
    if (personContact == null) {
      throw new Error("Email or phone not exist");
    }

    if (!templateID) {
      templateID = commType === coreConstant.commType.EMAIL ? coreConstant.communication.SENT_OTP_MAIL_EN : coreConstant.communication.SENT_OTP_SMS_EN;
    }

    let genetatedOTP = otpGenerator.generate(configProvider.wrappid.otpLength, {
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    if (genetatedOTP) {
      commData.otp = genetatedOTP;
    }

    let commResult = await communicate({
      commType,
      commRecipients: {
        to: [emailOrPhone]
      },
      commData,
      commTemplateID: templateID,
      directFlag: true,
      errorFlag: true
    });

    if (commResult) {
      await databaseActions.update("application", "Otps", { _status: coreConstant.entityStatus.INACTIVE }, {
        where: {
          type: commType,
          userId: userId,
        }
      });
      await databaseActions.create("application", "Otps", {
        otp: genetatedOTP,
        type: commType,
        _status: coreConstant.entityStatus.ACTIVE,
        userId: userId,
      });
      console.log(`OTP ${commType} sent successfully.`);
      return { status: 200, message: `OTP ${commType} sent successfully.` };
    } else {
      throw new Error(`OTP ${commType} sent failed.`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const postChangePasswordFunc = async (req, res) => {
  try {
    console.log(res);
    let { password, newPassword, confirmPassword } = req.body;

    let user = await databaseActions.findOne("application", "Users", {
      where: {
        id: req.user.userId
      }
    });
    let oldPassExist = checkPassword(password, user.password);

    if (password === newPassword) {
      throw new Error("Password can't be same.");
    }

    if (oldPassExist && newPassword === confirmPassword) {
      // 
      let result = await databaseActions.update("application", "Users", {
        password: bcrypt.hashSync(newPassword, 9)
      }, {
        where: {
          id: req.user.userId
        }
      });

      if (result) {
        return { status: 200, message: "Password changed successfully." };
        // res.status(200).json({message: "Password changed successfully."})
      } else {
        throw new Error("Something went wrong.");
      }
    } else {
      throw new Error("Old password is wrong.");
    }
  } catch (err) {
    console.log(err);
    return { status: 500, message: err?.message || "Something went wrong." };
    // res.status(500).json({ message: err?.message || "Something went wrong." });
  }
};

const postVerifyOtpFunc = async (req, res) => {
  try {
    console.log(res);
    var userId = req.user.userId;

    var person = await databaseActions.findOne("application", "Persons", {
      where: {
        userId: userId
      }
    });
    var personId = person.id;

    var otpInDb = await databaseActions.findOne("application", "Otps", {
      where: {
        userId: userId,
        isActive: true,
      },
      order: [
        ["id", "desc"]
      ]
    });

    console.log("OTP in db", otpInDb.otp);
    console.log("OTP by user", req.body.otp);

    if (req.body.otp == otpInDb.otp) {
      console.log("OTP matched");
      var [nrows] = await databaseActions.update("application", "PersonContacts",
        { verified: true },
        {
          where: {
            personId: personId,
            data: req.body.data,
          },
        }
      );
      if (nrows > 0) {
        console.log("Person contact updated.");
        console.log("OTP verified");
        return { status: 200, message: "OTP verified" };
        // res.status(200).json({ message: "OTP verified" });
      } else {
        console.log("Person contact not updated");
        return { status: 500, message: "Internal error" };
        // res.status(500).json({ message: "Internal error" });
      }
    } else {
      console.log(
        "OTP mismatch, dbOtp: ",
        otpInDb.otp,
        ",user given otp:",
        req.body.otp
      );
      return { status: 500, message: "OTP mismatch" };
      // res.status(500).json({ message: "OTP mismatch" });
    }
  } catch (err) {
    console.log(err);
    return { status: 500, message: "Error to fetch Contacts data" };
    // res.status(500).json({ message: "Error to fetch Contacts data" });
  }
};


module.exports = {
  checkLoginOrRegisterUtil,
  loginHelper,
  logoutHelper,
  getIPHelper,
  refreshTokenHelper,
  clientLoginInformationHelper,
  sentOtp,
  postChangePasswordFunc,
  postVerifyOtpFunc
};
