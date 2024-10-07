const RoutesRegistry = {
  socialLogin:{
    name:"socialLogin",
    url:"login/social/:platform",
    authRequired: false,
    reqMethod:"post",
    entityRef: "socialLogin",
    controllerRef: "socialLogin"
  }
};

export default RoutesRegistry;
