/* eslint-disable etc/no-commented-out-code */
import React from "react";

import {
  CoreAvatar,
  CoreBox,
  CoreClasses,
  CoreForm,
  CoreH6,
  CoreLayoutItem,
  CoreTextButton,
  CoreTypographyBody2,
  // coreUseNavigate,
  coreUseNavigate,
  stringUtils
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthState, saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

const LoginWithPassword = () => {
  const navigate = coreUseNavigate();

  const dispatch = useDispatch();
  // const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    // navigateToResetPasswordSuccess,
    // navigateToOtpSuccess,
    // checkLoginOrRegisterSuccess,
    // authNextPage,
    name,
    navData,
    photo,
    uid,
    accessToken
  } = auth;

  let authenticated = uid && accessToken ? true : false;

  // let authenticated = uid && accessToken ? true : false;

  const GoBack = () => {
    dispatch(
      saveAuthData({
        authNextPage                  : ModuleRoute.LOGIN_ROUTE,
        checkLoginOrRegisterError     : false,
        checkLoginOrRegisterLoading   : false,
        checkLoginOrRegisterMsg       : false,
        checkLoginOrRegisterSuccess   : false,
        navigateToOtpSuccess          : false,
        navigateToResetPasswordSuccess: false,
      })
    );

    dispatch(clearAuthState());
  };

  React.useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated]);

  const changeAuthNextPage = (routeName) => {
    // if((routeName === ModuleRoute.RESET_PASSWORD_ROUTE && (navigateToResetPasswordSuccess ||
    //     navigateToOtpSuccess) ||
    //     (!checkLoginOrRegisterSuccess &&
    //       authNextPage.toLowerCase() !== ModuleRoute.PASSWORD_ROUTE)) || routeName === ModuleRoute.LOGIN_OTP_ROUTE){
    //       }
    dispatch(saveAuthData({ authNextPage: routeName }));
  };

  // React.useEffect(() => {
  //   if (authenticated) {
  //     navigate("/");
  //   }
  // }, [authenticated]);

  // {(navigateToResetPasswordSuccess ||
  //   navigateToOtpSuccess) ||
  //   (!checkLoginOrRegisterSuccess &&
  //     authNextPage.toLowerCase() !== ModuleRoute.PASSWORD_ROUTE)
  //   ? (
  //     <CoreDomNavigate to={`/${authNextPage}`} />
  //   ) : (
  //   )}

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreBox
          styleClasses={[CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.MARGIN.MB3]}
        >
          <CoreAvatar
            styleClasses={[CoreClasses.DATA_DISPLAY.AVATAR_LARGE]}
            src={photo ? photo : "photo.jpg"}
          />
        </CoreBox>

        <CoreH6
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1, CoreClasses.COLOR.TEXT_PRIMARY]}
        >
          {name && name?.trim() !== "" ? name : "Unknown User"}
        </CoreH6>

        <CoreTypographyBody2
          limitChars={42}
          hideSeeMore={true}
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}
        >
          {stringUtils.maskEmailOrPhone(
            navData?.emailOrPhone
              ? navData?.emailOrPhone
              : ""
          )}
        </CoreTypographyBody2>

        <CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
        >
          <CoreTextButton onClick={GoBack} label="Not you" />
        </CoreBox>

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithPassword"
          mode="edit"
          authenticated={false}
        />

        <CoreBox
          styleClasses={[
            CoreClasses.LAYOUT.FULL_WIDTH,
            CoreClasses.FLEX.DIRECTION_ROW,
            CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_SPACE_AROUND,
            CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER,
            CoreClasses.MARGIN.MT3,
          ]}
        >
          {/**
                  * @TODO:
                  * we need send otp to the provided email or phone
                  * fix required: email or phone getting removed from store auth.navData
                  */}
          <CoreTextButton onClick={() => changeAuthNextPage(ModuleRoute.RESET_PASSWORD_ROUTE)}>
            Reset Password
          </CoreTextButton>

          <CoreTextButton onClick={() => changeAuthNextPage(ModuleRoute.LOGIN_OTP_ROUTE)}>
            Login with OTP
          </CoreTextButton>
        </CoreBox>

      </CoreLayoutItem>
    </>
  );
};

export default LoginWithPassword;

