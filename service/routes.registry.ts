const RoutesRegistry = {
  socialLogin:{
    title:"Diiferent social login",
    url:"login/social/:platform",
    authRequired: false,
    reqMethod:"post",
    entityRef: "socialLogin",
    controllerRef: "socialLogin",
    swaggerJson: {
      "tags": [
        "Auth"
      ],
      "parameters": [
        {
          "name": "platform",
          "in": "path",
          "description": "Name of the platformplatform",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],

      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "platformToken": {
                  "type": "string"
                }
              }
            },
            "examples": {
              "PostSocialLogin": {
                "value": {
                  "platformToken": "7ij6vfdar667hd",
                }
              }
            }
          }
        },
        "required": true,
        "description": "Login into your account"
      },
      "responses": {
        "200": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "status": {
                    "type": "integer"
                  },
                  "message": {
                    "type": "string"
                  },
                  "personId": {
                    "type": "integer"
                  },
                  "sessionId": {
                    "type": "integer"
                  },
                  "accessToken": {
                    "type": "string"
                  },
                  "refreshToken": {
                    "type": "string"
                  }
                }
              },
              "examples": {
                "PostSocialLogin": {
                  "value": {
                    "id": 587,
                    "status": 200,
                    "message": "Successfully login",
                    "personId": 45,
                    "sessionId": 343,
                    "accessToken": "eyJhbGciOiJIUzI1I6IkpXVCJ9.eyJ1c2VySWQiOjQxOCwiZW1haWwiOiJwcml0YW1AcnhlZnkuY25JZCI6MSwicm9sZUlkIjTcwOTU",
                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxOCwiZW1haWwiOiJwcml0YW1AcnhlZnkuY29tIiwicGhvbmUiOiIiLCJwZXJzb25JZCI6MSwi"
                  }
                }
              }
            }
          },
          "description": "Successful operation"
        },
        "404": {
          "description": "Request API Not Found!!"
        },
        "500": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                }
              },
              "examples": {
                "PostLogin": {
                  "value": {
                    "message": "Server Error"
                  }
                }
              }
            }
          },
          "description": "Internal Server Error"
        }
      }
    }
  },
  checkLogin: {
    title: "jnkf",
    url: "login/check",
    authRequired: false,
    reqMethod: "post",
    entityRef: "checkLogin",
    controllerRef: "checkLogin",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  registerWithPassword: {
    title: "jnkf",
    url: "register",
    authRequired: false,
    reqMethod: "post",
    entityRef: "registerWithPassword",
    controllerRef: "registerWithPassword",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  loginWithPassword: {
    title: "jnkf",
    url: "login/password",
    authRequired: false,
    reqMethod: "post",
    entityRef: "loginWithPassword",
    controllerRef: "loginWithPassword",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  loginWithOtpp: {
    title: "jnkf",
    url: "login/otp",
    authRequired: false,
    reqMethod: "post",
    entityRef: "loginWithOtpp",
    controllerRef: "loginWithOtpp",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  resetPassword: {
    title: "jnkf",
    url: "password/reset",
    authRequired: false,
    reqMethod: "post",
    entityRef: "resetPassword",
    controllerRef: "resetPassword",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  urlLogin: {
    title: "jnkf",
    url: "login/url",
    authRequired: false,
    reqMethod: "post",
    entityRef: "urlLogin",
    controllerRef: "urlLogin",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },
  refreshTokenn: {
    title: "jnkf",
    url: "token/refresh",
    authRequired: true,
    reqMethod: "post",
    entityRef: "refreshTokenn",
    controllerRef: "refreshTokenn",
    swaggerJson: {
      "tags":[
        "Auth-Module"
      ],
      "responses":{}
    }
  },


};

export default RoutesRegistry;