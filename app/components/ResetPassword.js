import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreTextButton,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils,
  coreUseNavigate,
  HTTP,
  apiRequestAction
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { saveAuthData } from "../actions/authActions";
import { ApiRegistry } from "../apis.registry";
import { ModuleRoute } from "../constants/app.constants";
import { GET_PROFILE_BASIC_ERROR, GET_PROFILE_BASIC_SUCCESS } from "../types/auth.types";
const ResetPassword = () => {
  const navigate = coreUseNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const { navData, uid, accessToken } = auth;

  let authenticated = uid && accessToken ? true : false;

  const GoBack = () => {
    dispatch(saveAuthData({
      authNextPage                  : ModuleRoute.LOGIN_ROUTE,
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterMsg       : false,
      checkLoginOrRegisterSuccess   : false,
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
          {" " + stringUtils.maskEmailOrPhone(navData?.emailOrPhone)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${isNaN(navData?.emailOrPhone) ? "email." : "phone."}`}
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

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
          {"Reset your account"}
        </CoreTypographyBody1>

        {showEmailOrPhone()}

        <CoreBox styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}>
          <CoreTextButton onClick={GoBack} label="Not You" />
        </CoreBox>

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithResetPassword"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: navData?.emailOrPhone } }}
        />
      </CoreLayoutItem>
    </>
  );
};

export default ResetPassword;