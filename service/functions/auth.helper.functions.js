const constant = require("../constants/constants");
const DeviceDetector = require("node-device-detector");




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
    return { valid: f, type: constant.communication.EMAIL };
  } else if (!f) {
    f = String(t).match(
      /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
    );
    if (f) {
      return { valid: f, type: constant.communication.SMS };
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

module.exports = { clearValidatePhoneEmail, getDeviceId, getIP };
