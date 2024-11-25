import React from "react";

import {
  CoreClasses,
  CoreForm,
  CoreLayoutItem,
  CoreLink,
  CoreRoutesContext,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useSelector } from "react-redux";

import NotYouButton from "./common/NotYouButton";
import AuthLayout from "./layout/AuthLayout";

const Register = () => {
  const { config: appConfig } = React.useContext(WrappidDataContext);
  const { authNextPage, identifier }  = useSelector(state => state.auth);
  const routeRegistry = React.useContext(CoreRoutesContext);

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
          {`Verify your${isNaN(identifier) ? " email" : " phone"}`}
        </CoreTypographyBody1>
        
        {/* eslint-disable-next-line etc/no-commented-out-code */}
        {/* <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your${isNaN(identifier) ? " email" : " phone"
          } through OTP`}
        </CoreTypographyBody1> */}

        {showEmailOrPhone()}

        <NotYouButton />

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="register"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: identifier } }}
        />

        {authNextPage === routeRegistry?.register?.url && (
          <CoreTypographyBody2 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>
            By signing up you agree to our{" "}

            <CoreLink
              href={
                appConfig?.wrappid?.privacyLink ||
                "#"
              }>
              Privacy Policy
            </CoreLink>{" "}

            <CoreTypographyBody2 component="span">&</CoreTypographyBody2>{" "}

            <CoreLink
              href={
                appConfig?.wrappid?.termsLink ||
                "#"
              }>
              Terms
            </CoreLink>

            {"."}
          </CoreTypographyBody2>
        )}

      </CoreLayoutItem >
    </>
  );
};

export default Register;