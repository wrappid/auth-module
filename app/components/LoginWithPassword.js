import { useContext } from "react";

import {
  CoreBox,
  CoreAvatar,
  CoreH6,
  CoreTypographyBody2,
  CoreTextButton,
  CoreForm,
  CoreLink,
  stringUtils,
  CoreClasses,
  CoreDomNavigate,
  CoreRouteRegistryContext
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import { AuthContainer } from "./AuthContainer";
import { clearAuthState, saveAuthData } from "../actions/authActions";

const LoginWithPassword = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const routeRegistry = useContext(CoreRouteRegistryContext);
  const {
    navigateToResetPasswordSuccess,
    navigateToOtpSuccess,
    checkLoginOrRegisterSuccess,
    authNextPage,
    name,
    navData,
    photo,
  } = auth;

  const GoBack = () => {
    dispatch(
      saveAuthData({
        authNextPage                  : "checkUserExist",
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

  if (
    (navigateToResetPasswordSuccess ||
      navigateToOtpSuccess ||
      !checkLoginOrRegisterSuccess) &&
    authNextPage !== routeRegistry?.enterpassword
  ) {
    return <CoreDomNavigate to={"/" + authNextPage} />;
  }
  else
    return (
      <AuthContainer>
        <CoreBox
          styleClasses={[CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.MARGIN.MB3]}
        >
          <CoreAvatar
            styleClasses={[CoreClasses.DATA_DISPLAY.AVATAR_LARGE]}
            src={photo ? photo : "photo.jpg"}
          />
        </CoreBox>

        <CoreH6
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
        >
          {name && name?.trim() !== "" ? name : "Unknown User"}
        </CoreH6>

        <CoreTypographyBody2
          limitChars={42}
          hideSeeMore={true}
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}
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
          <CoreTextButton OnClick={GoBack} label="Not you" />
        </CoreBox>

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId={"loginWithPassword"}
          mode={"edit"}
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
          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE]} href={"/" + routeRegistry?.resetpassword}>
            Reset Password
          </CoreLink>

          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE]} href={"/" + routeRegistry?.enterotp}>
            Login with OTP
          </CoreLink>
        </CoreBox>
      </AuthContainer>
    );
};

export default LoginWithPassword;

