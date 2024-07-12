import {
  ApplicationContext,
  coreConstant,
  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";
import DeviceDetector from "node-device-detector";
import otpGenerator from "otp-generator";


const COMMUNICATION_EMAIL = coreConstant.commType.EMAIL;
const COMMUNICATION_SMS = coreConstant.commType.SMS;
const COMMUNICATION_WHATSAPP = coreConstant.commType.WHATSAPP;
const COMMUNICATION_PUSH_NOTIFICATION = coreConstant.commType.NOTIFICATION;

/**
 * 
 * @param text 
 * @returns 
 */
function clearValidatePhoneEmail(text: any) {
  try {
    WrappidLogger.logFunctionStart("clearValidatePhoneEmail");
    let t = text;
    if (t[0] == "'") {
      t = t.slice(1);
      t = t.toLowerCase();
    }
    let f = String(t).match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (f) {
      return { valid: f, type: COMMUNICATION_EMAIL };
    } else if (!f) {
      f = String(t).match(
        /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
      );
      if (f) {
        return { valid: f, type: COMMUNICATION_SMS };
      } else {
        return { valid: f, type: "" };
      }
    }

    return [f, t];
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("clearValidatePhoneEmail");
  }
  
}

/**
 * 
 * @param req 
 * @returns 
 */
async function getDeviceId(req: any) {
  try {
    WrappidLogger.logFunctionStart("getDeviceId");
    // WrappidLogger.info("mac_ip" + mac_ip)
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: true,
    });
    const result = detector.detect(req.headers["user-agent"]);
    WrappidLogger.info("Result:: " + result);
    const ip = await getIP(req);
    // WrappidLogger.info('ip:: ', ip)
    let con = result.device.id + ip;
    con = con.trim();
    // hashedId =  await bcrypt.hashSync(con, 10)
    return con;
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getDeviceId");
  }
}

/**
 * 
 * @param req 
 * @returns 
 */
async function getIP(req: any) {
  try {
    let ip;
    WrappidLogger.logFunctionStart("getIP");
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else if (req.socket && req.socket.remoteAddress) {
      ip = req.socket.remoteAddress;
    } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else {
      ip = req.ip;
    }
    return ip;
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("getIP");
  }
}

/**
 * 
 * @param reciepients 
 * @param type 
 * @param template 
 * @param dataList 
 * @param otpFlag 
 * @param transaction 
 * @param requesterId 
 * @returns 
 */
async function communicate(
  reciepients: any = [],
  type: any = COMMUNICATION_EMAIL,
  template: any = null,
  dataList: any = [],
  otpFlag: any = false,
  transaction: any = null,
  requesterId: any = null
) {
  try {
    WrappidLogger.logFunctionStart("communicate");
    const otpLength = ApplicationContext.getContext("config").wrappid.otpLength;

    //   WrappidLogger.info("IN COMMUNICATE", transaction, otpFlag);
    let templateId: any = null;
    let templateName: any = null;
    let templateOb: any = null;
    if (typeof template === "string") {
      templateName = template;
    } else if (typeof template === "number") {
      templateId = template;
    }

    if (templateId) {
      let templateOb: any = await databaseActions.findByPk(
        "application",
        "CommunicationTemplates",
        templateId
      );
      if (templateOb._status !== coreConstant.entityStatus.APPROVED) {
        templateOb = null;
      }
    } else if (templateName) {
      templateOb = await databaseActions.findOne(
        "application",
        "CommunicationTemplates",
        {
          where: {
            name: templateName,
            _status: coreConstant.entityStatus.APPROVED,
          },
        }
      );
    }

    if (!templateOb) {
      console.error("Template not found:", template);
      return {
        success: false,
        error: "No template found",
      };
    }

    WrappidLogger.info("Template found " + templateOb.id);

    if (!Array.isArray(reciepients)) {
      WrappidLogger.info("Reciepient object turned into array");
      reciepients = [reciepients];
    }

    for (let i = 0; i < reciepients.length; i++) {
      let otp;
      let dataOb: any = dataList[i];
      if (otpFlag) {
        if (!dataList[i] || (dataList[i] && !dataList[i].otp)) {
          otp = otpGenerator.generate(otpLength, {
            specialChars: false,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
          });
          dataOb = {
            ...dataList[i],
            variable: { otp },
          };
          WrappidLogger.info("OTP AUTO GENERATED" + otp);
        } else {
          WrappidLogger.info("OTP :" +  dataOb);
          otp = dataList[i]?.variable?.otp;
        }
      }

      let dataObFinal = {
        ...dataOb,
        templateId: templateOb.id,
        status: "pending",
        _status: coreConstant.entityStatus.NEW,
        createdBy: requesterId,
      };
      let newCom: any = null;
      if (type === COMMUNICATION_EMAIL) {
        dataObFinal = {
          ...dataObFinal,
          userId: reciepients[i].id,
          to: reciepients[i].email,
        };
        newCom = await databaseActions.create(
          "application",
          "MailComms",
          dataObFinal,
          {
            transaction: transaction ? transaction : null,
          }
        );
        WrappidLogger.info("Mail com created");
      } else if (type == COMMUNICATION_SMS) {
        dataObFinal = {
          ...dataObFinal,
          userId: reciepients[i].id,
          to: reciepients[i].phone,
        };
        newCom = await databaseActions.create(
          "application",
          "SmsComms",
          dataObFinal,
          {
            transaction: transaction ? transaction : null,
          }
        );
        WrappidLogger.info("SMS com created");
      } else if (type == COMMUNICATION_WHATSAPP) {
        if (reciepients[i]?.id) {
          dataObFinal["userId"] = reciepients[i].id;
        }
        dataObFinal = {
          ...dataObFinal,
          to: reciepients[i].phone,
        };
        newCom = await databaseActions.create(
          "application",
          "WhatsAppComms",
          dataObFinal,
          {
            transaction: transaction ? transaction : null,
          }
        );
        WrappidLogger.info("Whatsapp com created");
      }
      if (otpFlag) {
        await databaseActions.update(
          "application",
          "Otps",
          { isActive: false },
          {
            where: {
              userId: reciepients[i].id,
            },
            transaction: transaction ? transaction : null,
          }
        );
        WrappidLogger.info("Old otp entries updated");

        const entry: any = { otp, userId: reciepients[i].id };
        if (type === COMMUNICATION_EMAIL) {
          entry["mailCommId"] = newCom.id;
        } else if (type === COMMUNICATION_SMS) {
          entry["smsCommId"] = newCom.id;
        } else if (type === COMMUNICATION_WHATSAPP) {
          entry["whatsAppCommId"] = newCom.id;
        } else {
          console.error("Communication type not implemented:", type);
          if (transaction) {
            throw "Communication type not implemented";
          } else {
            return {
              success: false,
              error: "Communication type not implemented:",
            };
          }
        }

        await databaseActions.create("application", "Otps", entry, {
          transaction: transaction ? transaction : null,
        });
        WrappidLogger.info("New  otp entry created");
      }

      /**
       * @todo: should be removed and call directly form queue subscriber
       */

      return { success: true, otp: otp };
    }
  } catch (error) {
    WrappidLogger.error("Error: " + error);
    throw error;
  }finally{
    WrappidLogger.logFunctionEnd("communicate");
  }
}

export {
  clearValidatePhoneEmail,
  getDeviceId,
  getIP,
  communicate,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
  COMMUNICATION_WHATSAPP,
  COMMUNICATION_PUSH_NOTIFICATION,
};
