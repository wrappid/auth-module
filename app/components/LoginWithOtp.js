import { Component } from "react";

import {
  CoreH1,
  CoreForm,
  CoreBox,
  CoreTextButton,
  apiRequestAction,
  maskEmailOrPhone,
  CoreClasses,
  HTTP,
  CoreTypographyBody2,
  CoreDomNavigate
} from "@wrappid/core";
import { connect } from "react-redux";

import { AuthContainer } from "./AuthContainer";
import { saveAuthData } from "../actions/authActions";
import { RoutesRegistry } from "../routes.registry";
import {
  NAVIGATE_TO_OTP_LOGIN_API,
  NAVIGATE_TO_OTP_LOGIN_ERROR,
  NAVIGATE_TO_OTP_LOGIN_LOADING,
  NAVIGATE_TO_OTP_LOGIN_SUCCESS
} from "../types/authTypes";
class LoginWithOtp extends Component {
  state = { otp: false };

  componentDidMount = () => {
  };

  componentDidUpdate = () => {
    if (this.state.submitFlag && this.props.auth.authError) {
      this.props.SaveAuthData({ authError: null });
      this.setState({ submitFlag: false });
    }
  };

  GoBack = () => {
    this.props.SaveAuthData({
      authNextPage                  : RoutesRegistry.LOGIN_ROUTE,
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpLoading          : false,
      navigateToOtpSuccess          : false,
      navigateToResetPasswordSuccess: false,
    });
  };

  render() {
    if (
      !this.props.checkLoginOrRegisterSuccess &&
      this.props.authNextPage !== RoutesRegistry.LOGIN_OTP_ROUTE
    ) {
      return <CoreDomNavigate to={"/" + this.props.authNextPage} />;
    }
    return (
      <AuthContainer>
        <CoreH1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]} variant="h5">
          Enter OTP
        </CoreH1>

        <CoreTypographyBody2>
          {`We have sent you a verification code on your ${
            isNaN(this.props.navData.emailOrPhone) ? " email " : " phone "
          } ${maskEmailOrPhone(
            this.props?.navData?.emailOrPhone
              ? this.props?.navData?.emailOrPhone
              : ""
          )}.\nPlease enter the One Time Password (OTP) to verify your ${
            isNaN(this.props.navData.emailOrPhone) ? " email." : " phone."
          }`}
        </CoreTypographyBody2>

        <CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
        >
          <CoreTextButton OnClick={this.GoBack} label="Not you" />
        </CoreBox>

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId={"loginWithOtp"}
          mode={"edit"}
          authenticated={false}
          initProps={
            { otp: { to: this.props?.navData?.emailOrPhone } }
          }
        />
      </AuthContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth        : state.auth,
    authNextPage: state.auth.authNextPage,

    checkLoginOrRegisterError  : state.auth.checkLoginOrRegisterError,
    checkLoginOrRegisterLoading: state.auth.checkLoginOrRegisterLoading,
    checkLoginOrRegisterSuccess: state.auth.checkLoginOrRegisterSuccess,
    navData                    : state.auth.navData,
    navigateToOtpLoading       : state.auth.navigateToOtpLoading,
    navigateToOtpSuccess       : state.auth.navigateToOtpSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    SaveAuthData: (data) => {
      dispatch(saveAuthData(data));
    },
    SendOtp: (data) => {
      dispatch(
        apiRequestAction(
          HTTP.POST,
          NAVIGATE_TO_OTP_LOGIN_API,
          true,
          data,
          NAVIGATE_TO_OTP_LOGIN_SUCCESS,
          NAVIGATE_TO_OTP_LOGIN_ERROR,
          null, //localAction,
          null, //includeFile,
          null, //file,
          null, //formId,
          null, //reload,
          null, //reduxData,
          null, //pushSnack,
          NAVIGATE_TO_OTP_LOGIN_LOADING, //loadingType,
          null //resetLoadingType,
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithOtp);
