import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreDomNavigate,
  CoreForm,
  CoreH1,
  CoreLayoutItem,
  CoreTextButton,
  CoreTypographyBody2,
  coreUseNavigate,
  stringUtils
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import { saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

const LoginWithOtp = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    checkLoginOrRegisterSuccess,
    authNextPage,
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
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpLoading          : false,
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
      navigate("/");
    }
  }, [authenticated]);

  /**
   * @todo
   *  review required
   */
  // eslint-disable-next-line etc/no-commented-out-code
  // if (!checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE) {
  //   navigate(`/${authNextPage}`);
  // }

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {(!checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE) ? <CoreDomNavigate to={`/${authNextPage}`} /> : <>
          <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]} variant="h5">
            Enter OTP
          </CoreH1><CoreTypographyBody2>
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
        </>
        }
      </CoreLayoutItem>
    </>
  );
};

export default LoginWithOtp;