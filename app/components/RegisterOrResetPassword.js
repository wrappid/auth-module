import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreDomNavigate,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreLink,
  CoreRoutesContext,
  CoreTextButton,
  CoreTypographyBody1,
  CoreTypographyBody2,
  coreUseNavigate,
  stringUtils
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useDispatch, useSelector } from "react-redux";

import { saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

const RegisterOrResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = coreUseNavigate();
  const { config: appConfig } = React.useContext(WrappidDataContext);

  const auth = useSelector(state => state.auth);
  const routeRegistry = React.useContext(CoreRoutesContext);

  const { checkLoginOrRegisterSuccess, authNextPage, navData } = auth;

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
      <CoreTypographyBody2 styleClasses={[CoreClasses.TEXT.TEXT_JUSTIFY]}>
        <CoreTypographyBody2 component="span">
          We have sent you a verification code on
        </CoreTypographyBody2>

        <CoreTypographyBody2
          component="span"
          limitChars={42}
          hideSeeMore={true}

        >
          {" " + stringUtils.maskEmailOrPhone(navData?.emailOrPhone)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${isNaN(navData?.emailOrPhone) ? " email." : " phone."
          }`}
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

  if (
    !checkLoginOrRegisterSuccess &&
    (authNextPage.toLowerCase() !== ModuleRoute.REGISTER_ROUTE ||
      authNextPage.toLowerCase() !== ModuleRoute.RESET_PASSWORD_ROUTE)
  ) {
    navigate(`/${authNextPage}`);
  }

  return (
    <>
      {(!checkLoginOrRegisterSuccess &&
        (authNextPage.toLowerCase() !== ModuleRoute.REGISTER_ROUTE ||
          authNextPage.toLowerCase() !== ModuleRoute.RESET_PASSWORD_ROUTE)) ? <CoreDomNavigate to={`/${authNextPage}`} /> : (
          <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
            <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
              {`Verify your${isNaN(navData?.emailOrPhone) ? " email" : " phone"
              }`}
            </CoreH1>

            {authNextPage === routeRegistry.register?.url ? (<>
              <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
                {`Verify your${isNaN(navData?.emailOrPhone) ? " email" : " phone"
                } through OTP`}
              </CoreTypographyBody1>

              {showEmailOrPhone()}
            </>
            ) : (
              <>
                {

                  <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
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
              formId="loginWithResetPassword"
              mode="edit"
              authenticated={false}
              initProps={{ otp: { to: navData?.emailOrPhone } }}
            />

            {authNextPage === routeRegistry?.register?.url && (
              <CoreTypographyBody2>
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

          </CoreLayoutItem >)
      }
    </>
  );
};

export default RegisterOrResetPassword;