export const RoutesRegistry = {
  check: {
    Page        : { appComponent: "CheckUserExist", layout: "AuthLayout" },
    authRequired: false,
    entityRef   : "check",
    url         : "check"
  },
  linkedin: {
    Page        : { appComponent: "LinkedIn" },
    authRequired: false,
    entityRef   : "linkedin",
    url         : "linkedin"
  }
};