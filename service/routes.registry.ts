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
  test: {
    name: "Test database API",
    url: "testdb",
    authRequired: false,
    entityRef: "test",
    reqMethod: "get",
    controllerRef: "test",
    system: false
  }
};

export default RoutesRegistry;
