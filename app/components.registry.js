import CheckUserExist from "./components/CheckUserExist";
import AuthLayout from "./components/layout/AuthLayout";
import LoginWithOtp from "./components/LoginWithOtp";
import LoginWithPassword from "./components/LoginWithPassword";
import RegisterPage from "./components/RegisterPage";
import ResetPassword from "./components/ResetPassword";

export const ComponentsRegistry = {
  AuthLayout       : { comp: AuthLayout, layout: true },
  RegisterPage     : { comp: RegisterPage },
  checkUserExist   : { comp: CheckUserExist },
  loginWithOtp     : { comp: LoginWithOtp },
  loginWithPassword: { comp: LoginWithPassword },
  resetPassword    : { comp: ResetPassword }
};
