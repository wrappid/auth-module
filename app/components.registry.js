import CheckUserExist from "./components/CheckUserExist";
import AuthLayout from "./components/layout/AuthLayout";
import LoginWithOtp from "./components/LoginWithOtp";
import LoginWithPassword from "./components/LoginWithPassword";
import RegisterOrResetPassword from "./components/RegisterOrResetPassword";

export const ComponentsRegistry = {
  AuthLayout       : { comp: AuthLayout, layout: true },
  CheckUserExist   : { comp: CheckUserExist },
  LoginWithOtp     : { comp: LoginWithOtp },
  LoginWithPassword: { comp: LoginWithPassword },
  Register         : { comp: RegisterOrResetPassword },
  ResetPassword    : { comp: RegisterOrResetPassword }
};
