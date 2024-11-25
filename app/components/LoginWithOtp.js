import {
  CoreClasses,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { useSelector } from "react-redux";

import NotYouButton from "./common/NotYouButton";
import AuthLayout from "./layout/AuthLayout";

const LoginWithOtp = () => {
  const auth = useSelector(state => state.auth);
  const {
    navData,
    identifier,
  } = auth;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>

        <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]} variant="h5">
          Enter OTP
        </CoreH1>
        
        <CoreTypographyBody2 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`We have sent you a verification code on your ${isNaN(identifier) ? " email " : " phone "} ${stringUtils.maskEmailOrPhone(
            navData?.identifier
              ? navData?.identifier
              : ""
          )}.\nPlease enter the One Time Password (OTP) to verify your ${isNaN(identifier) ? " email." : " phone."}`}
        </CoreTypographyBody2>
        
        <NotYouButton />
        
        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithOtp"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: navData?.identifier } }} />

      </CoreLayoutItem>
    </>
  );
};

export default LoginWithOtp;