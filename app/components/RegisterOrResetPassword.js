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
  stringUtils,
  coreUseNavigate
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useDispatch, useSelector } from "react-redux";

import { saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

const RegisterOrResetPassword = () => {
  const navigate = coreUseNavigate();
  const dispatch = useDispatch();
  // eslint-disable-next-line etc/no-commented-out-code
  // const navigate = coreUseNavigate();
  const { config: appConfig } = React.useContext(WrappidDataContext);

  const auth = useSelector(state => state.auth);
  const routeRegistry = React.useContext(CoreRoutesContext);

  const { authNextPage, navData, uid, accessToken } = auth;

  let authenticated = uid && accessToken ? true : false;

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

  React.useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated]);

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
          {" " + stringUtils.maskEmailOrPhone(navData?.emailOrPhone)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${isNaN(navData?.emailOrPhone) ? " email." : " phone."
          }`}
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

  // eslint-disable-next-line etc/no-commented-out-code
  // if (
  //   !checkLoginOrRegisterSuccess &&
  //   (authNextPage.toLowerCase() !== ModuleRoute.REGISTER_ROUTE ||
  //     authNextPage.toLowerCase() !== ModuleRoute.RESET_PASSWORD_ROUTE)
  // ) {
  //   navigate(`/${authNextPage}`);
  // }

  // {(!checkLoginOrRegisterSuccess &&
  //   (authNextPage.toLowerCase() !== ModuleRoute.REGISTER_ROUTE ||
  //     authNextPage.toLowerCase() !== ModuleRoute.RESET_PASSWORD_ROUTE)) ? <CoreDomNavigate to={`/${authNextPage}`} /> : ()
  // }

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your${isNaN(navData?.emailOrPhone) ? " email" : " phone"
          }`}
        </CoreH1>

        {authNextPage === routeRegistry.register?.url ? (<>
          <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
            {`Verify your${isNaN(navData?.emailOrPhone) ? " email" : " phone"
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
          formId="loginWithResetPassword"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: navData?.emailOrPhone } }}
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

export default RegisterOrResetPassword;