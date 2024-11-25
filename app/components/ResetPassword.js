import {
  CoreClasses,
  CoreForm,
  CoreLayoutItem,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { useSelector } from "react-redux";

import NotYouButton from "./common/NotYouButton";
import AuthLayout from "./layout/AuthLayout";

const ResetPassword = () => {
  const { identifier } = useSelector(state => state.auth);

  const showEmailOrPhone = () => {
    return (
      <CoreTypographyBody2 styleClasses={[CoreClasses.TEXT.TEXT_JUSTIFY, CoreClasses.COLOR.TEXT_PRIMARY]}>
        <CoreTypographyBody2 component="span">
          We have sent you a verification code on
        </CoreTypographyBody2>

        <CoreTypographyBody2
          component="span"
          limitChars={42}
          hideSeeMore={true}

        >
          {" " + stringUtils.maskEmailOrPhone(identifier)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${isNaN(identifier) ? " email." : " phone."
          }`}
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your${isNaN(identifier) ? " email" : " phone"
          }`}
        </CoreTypographyBody1>

        <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {"Reset password through OTP"}
        </CoreTypographyBody1>

        {showEmailOrPhone()}

        <NotYouButton />

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithResetPassword"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: identifier } }}
        />

      </CoreLayoutItem >
    </>
  );
};

export default ResetPassword;