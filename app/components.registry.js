import CheckUserExist from "./components/CheckUserExist";
import AuthLayout from "./components/layout/AuthLayout";
import LinkedIn from "./components/LinkedIn";
import LoginWithOtp from "./components/LoginWithOtp";
import LoginWithPassword from "./components/LoginWithPassword";
import RegisterOrResetPassword from "./components/RegisterOrResetPassword";

export const ComponentsRegistry = {
  AuthLayout       : { comp: AuthLayout, layout: true },
  LinkedIn         : { comp: LinkedIn },
  checkUserExist   : { comp: CheckUserExist },
  loginWithOtp     : { comp: LoginWithOtp },
  loginWithPassword: { comp: LoginWithPassword },
  register         : { comp: RegisterOrResetPassword },
  resetPassword    : { comp: RegisterOrResetPassword }
};
