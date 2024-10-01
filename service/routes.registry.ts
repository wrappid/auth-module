const RoutesRegistry = {
  facebook:{
    name:"facebook",
    url:"social/login/:platform",
    authRequired: false,
    reqMethod:"post",
    entityRef: "facebook",
    controllerRef: "facebook"
  },
};

export default RoutesRegistry;
