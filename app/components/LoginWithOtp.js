
import {
  CoreBox,
  CoreClasses,
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

const LoginWithOtp = () => {
  const dispatch = useDispatch();
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    checkLoginOrRegisterSuccess,
    authNextPage,
    navData
  } = auth;

  const GoBack = () => {
    dispatch(saveAuthData({
      authNextPage                  : "checkuserexists",
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpLoading          : false,
      navigateToOtpSuccess          : false,
      navigateToResetPasswordSuccess: false,
    }));
  };

  /**
   * @todo
   *  review required
   */
  if (!checkLoginOrRegisterSuccess && authNextPage !== "checkuserexists") {
    navigate(`/${authNextPage}`);
  }

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]} variant="h5">
          Enter OTP
        </CoreH1>

        <CoreTypographyBody2>
          {`We have sent you a verification code on your ${isNaN(navData?.emailOrPhone) ? " email " : " phone "
          } ${stringUtils.maskEmailOrPhone(
            navData?.emailOrPhone
              ? navData?.emailOrPhone
              : ""
          )}.\nPlease enter the One Time Password (OTP) to verify your ${isNaN(navData.emailOrPhone) ? " email." : " phone."
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

      </CoreLayoutItem>
    </>
  );
};

export default LoginWithOtp;