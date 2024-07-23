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

import { saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ApiRegistry } from "../apis.registry";
import { ModuleRoute } from "../constants/app.constants";
import { GET_PROFILE_BASIC_ERROR, GET_PROFILE_BASIC_SUCCESS } from "../types/authTypes";

const LoginWithOtp = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    // checkLoginOrRegisterSuccess,
    // authNextPage,
    navData,
    uid,
    accessToken
  } = auth;

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
    // eslint-disable-next-line etc/no-commented-out-code
    // if (!checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE) {
    //   navigate(`/${authNextPage}`);
    // }
  };

  React.useEffect(() => {
    if (authenticated) {
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

  /**
   * @todo
   *  review required
   */
  // eslint-disable-next-line etc/no-commented-out-code
  // if (!checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE) {
  //   navigate(`/${authNextPage}`);
  // }
  //(!checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE) ? <CoreDomNavigate to={`/${authNextPage}`} /> : 
  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        
        <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]} variant="h5">
            Enter OTP
        </CoreH1><CoreTypographyBody2 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>
          {`We have sent you a verification code on your ${isNaN(navData?.emailOrPhone) ? " email " : " phone "} ${stringUtils.maskEmailOrPhone(
            navData?.emailOrPhone
              ? navData?.emailOrPhone
              : ""
          )}.\nPlease enter the One Time Password (OTP) to verify your ${isNaN(navData.emailOrPhone) ? " email." : " phone."}`}
        </CoreTypographyBody2><CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
        >
          <CoreTextButton onClick={GoBack} label="Not you" />
        </CoreBox><CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithOtp"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: navData?.emailOrPhone } }} />
        
      </CoreLayoutItem>
    </>
  );
};

export default LoginWithOtp;