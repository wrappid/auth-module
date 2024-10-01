const RoutesRegistry = {
  linkedInAccessCode:{
    name: "",
    url: "accesscode",
    authRequired: false,
    reqMethod: "post",
    entityRef: "linkedInAccessCode",
    controllerRef: "linkedInAccessCode"
  },
  linkedin:{
    name: "",
    url: "social/login/:platform",
    authRequired: false,
    reqMethod: "post",
    entityRef: "linkedin",
    controllerRef: "linkedin"
  },

};

export default RoutesRegistry;
