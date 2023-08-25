const {
  configProvider,
  coreConstant,
  databaseActions,
  databaseProvider,
} = require("@wrappid/service-core");
const DeviceDetector = require("node-device-detector");
const otpGenerator = require("otp-generator");
const otpLength = configProvider.databases[0]["otpLength"];

const COMMUNICATION_EMAIL = coreConstant.commType.EMAIL;
const COMMUNICATION_SMS = coreConstant.commType.SMS;
const COMMUNICATION_WHATSAPP = coreConstant.commType.WHATSAPP;
const COMMUNICATION_PUSH_NOTIFICATION = coreConstant.commType.NOTIFICATION;

function clearValidatePhoneEmail(text) {
  let t = text;
  if (t[0] == "'") {
    t = t.slice(1);
    t = t.toLowerCase();
  }
  let f = String(t).match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  if (f) {
    return { valid: f, type: coreConstant.communication.EMAIL };
  } else if (!f) {
    f = String(t).match(
      /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
    );
    if (f) {
      return { valid: f, type: coreConstant.communication.SMS };
    } else {
      return { valid: f, type: "" };
    }
  }

  return [f, t];
}

async function getDeviceId(req) {
  // console.log("mac_ip", mac_ip)
  let detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: true,
  });
  let result = detector.detect(req.headers["user-agent"]);
  console.log("Result:: ", result);
  let ip = await getIP(req);
  // console.log('ip:: ', ip)
  let con = result.device.id + ip;
  con = con.trim();
  // hashedId =  await bcrypt.hashSync(con, 10)
  return con;
}

async function getIP(req) {
  let ip;
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
}

async function communicate(
  reciepients = [],
  type = COMMUNICATION_EMAIL,
  template = null,
  dataList = [],
  otpFlag = false,
  transaction = null,
  requesterId = null
) {
  try{
  //   console.log("IN COMMUNICATE", transaction, otpFlag);
  var templateId = null;
  var templateName = null;
  var templateOb = null;
  if (typeof template === "string") {
    templateName = template;
  } else if (typeof template === "number") {
    templateId = template;
  }

  if (templateId) {
    templateOb = await databaseActions.findByPk(
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

  console.log("Template found", templateOb.id);

  if (!Array.isArray(reciepients)) {
    console.log("Reciepient object turned into array");
    reciepients = [reciepients];
  }

  for (var i = 0; i < reciepients.length; i++) {
    var dataOb = dataList[i];

    if (otpFlag) {
      var otp = null;
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
        console.log("OTP AUTO GENERATED", otp);
      } else {
        console.log("OTP :", dataOb);
        otp = dataList[i]?.variable?.otp;
      }
    }

    var dataObFinal = {
      ...dataOb,
      templateId: templateOb.id,
      status: "pending",
      _status: coreConstant.entityStatus.NEW,
      createdBy: requesterId,
    };
    var newCom = null;
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
      console.log("Mail com created");
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
      console.log("SMS com created");
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
      console.log("Whatsapp com created");
    }
    if (otpFlag) {
      var updateOldOtp = await databaseActions.update(
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
      console.log("Old otp entries updated");

      var entry = { otp, userId: reciepients[i].id };
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

      var otpEntry = await databaseActions.create(
        "application",
        "Otps",
        entry,
        {
          transaction: transaction ? transaction : null,
        }
      );
      console.log("New  otp entry created");
    }

    /**
     * @todo: should be removed and call directly form queue subscriber
     */
 
    return { success: true, otp: otp };
  }
  }catch(error){
    console.log(error);
    throw error;
  }
}

module.exports = {
  clearValidatePhoneEmail,
  getDeviceId,
  getIP,
  communicate,
  COMMUNICATION_EMAIL,
  COMMUNICATION_SMS,
  COMMUNICATION_WHATSAPP,
  COMMUNICATION_PUSH_NOTIFICATION,
};
