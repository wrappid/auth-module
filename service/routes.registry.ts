const RoutesRegistry = {
  helloWorld:{
    name: "",
    url: "hello",
    authRequired: false,
    reqMethod: "get",
    entityRef: "helloWorld",
    controllerRef: "helloWorld"
  },
  linkedInAccessCode:{
    name: "",
    url: "accesscode",
    authRequired: false,
    reqMethod: "post",
    entityRef: "linkedInAccessCode",
    controllerRef: "linkedInAccessCode"
  },

};

export default RoutesRegistry;
