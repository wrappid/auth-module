import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreH1,
  CoreLayoutItem,
  CoreLink,
  CoreTextButton,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils,
  coreUseNavigate,
  CoreForm,
  apiRequestAction,
  HTTP
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { saveAuthData } from "../actions/authActions";
import { ApiRegistry } from "../apis.registry";
import { ModuleRoute } from "../constants/app.constants";
import { GET_PROFILE_BASIC_ERROR, GET_PROFILE_BASIC_SUCCESS } from "../types/auth.types";

const RegisterPage = () => {
  const auth = useSelector(state => state.auth);
  const { registerSuccess, uid, accessToken } = auth;
  let authenticated = registerSuccess && uid && accessToken ? true : false;
  const navigate = coreUseNavigate();
  const dispatch = useDispatch();
  const { config: appConfig } = React.useContext(WrappidDataContext);

  const { navData } = auth;

  const GoBack = () => {
    dispatch(saveAuthData({
      authNextPage               : ModuleRoute.LOGIN_ROUTE,
      checkLoginOrRegisterError  : false,
      checkLoginOrRegisterLoading: false,
      checkLoginOrRegisterMsg    : false,
      checkLoginOrRegisterSuccess: false,
      navigateToOtpSuccess       : false,
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
          {" " + stringUtils.maskEmailOrPhone(navData?.emailOrPhone)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${isNaN(navData?.emailOrPhone) ? "email." : "phone."}`}
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

  // React.useEffect(() => {
  //   if (registerSuccess) {
  //     dispatch({
  //       authNextPage: ModuleRoute.LOGIN_DASHBOARD,
  //       type: LOGIN_SUCCESS
  //     })
  //   }
  // }, [registerSuccess]);

  React.useEffect(() => {
    if (authenticated) {
      /**
       * @todo
       * Must be driven from AuthLayout
       */
      GetProfileBasic({ _defaultFilter: encodeURIComponent(JSON.stringify({ userId: auth.uid })) });

      navigate("/");
    }
  }, [authenticated]);

  const GetProfileBasic = (query) => {
    dispatch(
      apiRequestAction(
        HTTP.GET,
        ApiRegistry.GET_PROFILE_BASIC_API,
        true,
        query,
        GET_PROFILE_BASIC_SUCCESS,
        GET_PROFILE_BASIC_ERROR
      )
    );
  };

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your ${isNaN(navData?.emailOrPhone) ? "email" : "phone"}`}
        </CoreH1>

        <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`Verify your ${isNaN(navData?.emailOrPhone) ? "email" : "phone"} through OTP`}
        </CoreTypographyBody1>

        {showEmailOrPhone()}

        <CoreBox styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}>
          <CoreTextButton onClick={GoBack} label="Not You" />
        </CoreBox>

        <CoreForm
          formId="registerUser"
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: navData?.emailOrPhone } }}
        />

        <CoreTypographyBody2 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>
          By signing up you agree to our{" "}

          <CoreLink href={appConfig?.wrappid?.privacyLink || "#"}>
            Privacy Policy
          </CoreLink>{" "}

          <CoreTypographyBody2 component="span">&</CoreTypographyBody2>{" "}

          <CoreLink href={appConfig?.wrappid?.termsLink || "#"}>
            Terms
          </CoreLink>

          {"."}
        </CoreTypographyBody2>
      </CoreLayoutItem>
    </>
  );
};

export default RegisterPage;