import CheckUserExist from "./components/CheckUserExist";
import AuthLayout from "./components/layout/AuthLayout";
import LoginWithOtp from "./components/LoginWithOtp";
import LoginWithPassword from "./components/LoginWithPassword";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";

export const ComponentsRegistry = {
  AuthLayout       : { comp: AuthLayout, layout: true },
  checkUserExist   : { comp: CheckUserExist },
  loginWithOtp     : { comp: LoginWithOtp },
  loginWithPassword: { comp: LoginWithPassword },
  register         : { comp: Register },
  resetPassword    : { comp: ResetPassword },
};
