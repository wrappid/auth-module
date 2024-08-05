import AuthLayout from "./components/layout/AuthLayout";

export const RoutesRegistry = {
  check: {
    Page        : { appComponent: "CheckUserExist", layout: AuthLayout.name },
    authRequired: false,
    entityRef   : "check",
    url         : "check"
  },
};