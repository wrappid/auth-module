const RoutesRegistry = {
  CheckUserExist: {
    name: "Get Version API",
    url: "CheckUserExist",
    authRequired: false,
    entityRef: "CheckUserExist",
    reqMethod: "get",
    controllerRef: "CheckUserExist",
    system: false
  },
  loginwithPassword: {
    name: "Login with password",
    url: "loginwithPassword",
    authRequired: false,
    entityRef: "loginwithPassword",
    reqMethod: "post",
    controllerRef: "loginwithPassword",
    system: false
  },
  loginWithOTP: {
    name: "",
    url: "loginwithotp",
    authRequired: false,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "loginwithotp",
    system: false
  },
  resetPassword: {
    name: "",
    url: "resetPassword",
    authRequired: false,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "resetPassword",
    system: false
  },
  changePassword: {
    name: "",
    url: "changePassword",
    authRequired: true,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "changePassword",
    system: false
  },
  accessToken: {
    name: "",
    url: "accessToken",
    authRequired: true,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "accessToken",
    system: false
  },
  newRefreshToken: {
    name: "",
    url: "newRefreshToken",
    authRequired: true,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "newRefreshToken",
    system: false
  },
  logout: {
    name: "",
    url: "newLogout",
    authRequired: true,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "logout",
    system: false
  },
  register: {
    name: "",
    url: "register",
    authRequired: false,
    entityRef: "",
    reqMethod: "post",
    controllerRef: "register",
    system: false
  }
};

export default RoutesRegistry;
