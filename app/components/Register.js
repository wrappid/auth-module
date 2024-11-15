import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreLink,
  CoreRoutesContext,
  CoreTextButton,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { saveAuthData } from "../actions/authActions";
import { ModuleRoute } from "../constants/app.constants";

const Register = () => {
  const dispatch = useDispatch();
  const { config: appConfig } = React.useContext(WrappidDataContext);
  const { authNextPage, identifier }  = useSelector(state => state.auth);
  const routeRegistry = React.useContext(CoreRoutesContext);

  const GoBack = () => {
    dispatch(saveAuthData({
      authNextPage                  : ModuleRoute.LOGIN_ROUTE,
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterMsg       : false,
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpSuccess          : false,
      navigateToResetPasswordSuccess: false,
    }));
  };

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
        <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your${isNaN(identifier) ? " email" : " phone"
          }`}
        </CoreH1>

        {authNextPage === routeRegistry.register?.url ? (<>
          <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
            {`Verify your${isNaN(identifier) ? " email" : " phone"
            } through OTP`}
          </CoreTypographyBody1>

          {showEmailOrPhone()}
        </>
        ) : (
          <>
            {

              <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
                {"Reset your account"}
              </CoreTypographyBody1>
            }

            {showEmailOrPhone()}
          </>
        )}

        <CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}>
          <CoreTextButton onClick={GoBack} label="Not You" />
        </CoreBox>

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