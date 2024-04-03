
import {
  CoreAvatar,
  CoreBox,
  CoreClasses,
  CoreDomNavigate,
  CoreForm,
  CoreH6,
  CoreLayoutItem,
  CoreLink,
  CoreTextButton,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthState, saveAuthData } from "../actions/authActions";
// eslint-disable-next-line import/order
import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

const LoginWithPassword = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
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

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {(navigateToResetPasswordSuccess ||
          navigateToOtpSuccess) ||
          (!checkLoginOrRegisterSuccess &&
            authNextPage.toLowerCase() !== ModuleRoute.PASSWORD_ROUTE)
          ? (
            <CoreDomNavigate to={`/${authNextPage}`} />
          ) : (
            <>
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
                <CoreLink href={"/resetpassword"}>
                  Reset Password
                </CoreLink>

                <CoreLink href={"/enterotp"}>
                  Login with OTP
                </CoreLink>
              </CoreBox>
            </>
          )}

      </CoreLayoutItem>
    </>
  );
};

export default LoginWithPassword;

