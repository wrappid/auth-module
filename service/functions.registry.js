const authFunctions = require("./functions/auth.functions");

const functionsRegistry = {
  "checkLoginOrRegisterUtil" : authFunctions.checkLoginOrRegisterUtil,
  "loginHelper" : authFunctions.loginHelper,
  "logoutHelper" : authFunctions.logoutHelper,
  "getIPHelper": authFunctions.getIPHelper,
  "refreshTokenHelper": authFunctions.refreshTokenHelper  
};

exports.functionsRegistry = functionsRegistry;