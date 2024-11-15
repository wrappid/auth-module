import React from "react";

import {
  apiRequestAction,
  CoreBox,
  CoreClasses,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreTextButton,
  CoreTypographyBody2,
  coreUseNavigate,
  HTTP,
  stringUtils
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { saveAuthData } from "../actions/authActions";
import { ApiRegistry } from "../apis.registry";
import { ModuleRoute } from "../constants/app.constants";
import { GET_PROFILE_BASIC_ERROR, GET_PROFILE_BASIC_SUCCESS } from "../types/authTypes";

const LoginWithOtp = () => {
  const dispatch = useDispatch();
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    navData,
    accessToken,
    identifier,
    navData: { userID }
  } = auth;

  let authenticated = accessToken ? true : false;

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
      GetProfileBasic({ _defaultFilter: encodeURIComponent(JSON.stringify({ userId: userID })) });
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

        <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]} variant="h5">
          Enter OTP
        </CoreH1><CoreTypographyBody2 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`We have sent you a verification code on your ${isNaN(identifier) ? " email " : " phone "} ${stringUtils.maskEmailOrPhone(
            navData?.identifier
              ? navData?.identifier
              : ""
          )}.\nPlease enter the One Time Password (OTP) to verify your ${isNaN(identifier) ? " email." : " phone."}`}
        </CoreTypographyBody2><CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
        >
          <CoreTextButton onClick={GoBack} label="Not you" />
        </CoreBox><CoreForm
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