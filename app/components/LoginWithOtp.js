import React, { useContext } from 'react';
import {
  CoreH1,
  CoreForm,
  CoreBox,
  CoreTextButton,
  maskEmailOrPhone,
  CoreClasses,
  CoreTypographyBody2,
  CoreDomNavigate,
  CoreRouteRegistryContext
} from "@wrappid/core";

import { AuthContainer } from "./AuthContainer";
import { saveAuthData } from "../actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const LoginWithOtp = props => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const routeRegistry = useContext(CoreRouteRegistryContext)
  const {
    checkLoginOrRegisterSuccess,
    authNextPage,
    navData  
  } = auth;


  const GoBack = () => {
    dispatch(saveAuthData({
      authNextPage                  : routeRegistry?.checkUserExists,
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpLoading          : false,
      navigateToOtpSuccess          : false,
      navigateToResetPasswordSuccess: false,
    }))
  };

  if (
        !checkLoginOrRegisterSuccess &&
        authNextPage !== routeRegistry?.checkuserexists
      ) {
        return <CoreDomNavigate to={"/" + authNextPage} />;
    }
    else
      return (
        <AuthContainer>
          <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]} variant="h5">
            Enter OTP
          </CoreH1>

          <CoreTypographyBody2>
            {`We have sent you a verification code on your ${
              isNaN(navData?.emailOrPhone) ? " email " : " phone "
            } ${maskEmailOrPhone(
              navData?.emailOrPhone
                ? navData?.emailOrPhone
                : ""
            )}.\nPlease enter the One Time Password (OTP) to verify your ${
              isNaN(navData.emailOrPhone) ? " email." : " phone."
            }`}
          </CoreTypographyBody2>

          <CoreBox
            styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
          >
            <CoreTextButton OnClick={GoBack} label="Not you" />
          </CoreBox>

          <CoreForm
            styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
            formId={"loginWithOtp"}
            mode={"edit"}
            authenticated={false}
            initProps={
              { otp: { to: navData?.emailOrPhone } }
            }
          />
        </AuthContainer>
      );
}

export default LoginWithOtp