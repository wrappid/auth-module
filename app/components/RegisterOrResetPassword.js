import { Component } from "react";

import {
  CoreDomNavigate,
  CoreH1,
  CoreTypographyBody1,
  CoreTypographyBody2,
  CoreForm,
  CoreTextButton,
  CoreBox,
  CoreLink,
  apiRequestAction,
  maskEmailOrPhone,
  CoreClasses,
  HTTP
} from "@wrappid/core";
import { getConfigurationObject } from "@wrappid/styles";
import { connect } from "react-redux";

import { AuthContainer } from "./AuthContainer";
import { saveAuthData } from "../actions/authActions";
import { RoutesRegistry } from "../routes.registry";
import {
  CHECK_LOGIN_ERROR,
  NAVIGATE_TO_RESET_PASSWORD_API,
  NAVIGATE_TO_RESET_PASSWORD_SUCCESS
} from "../types/authTypes";

const appConfig = getConfigurationObject();

class RegisterOrResetPassword extends Component {
  state = {};

  componentDidUpdate = () => {
    if (this.state.submitFlag && this.props.auth.authError) {
      this.props.SaveAuthData({ authError: null });
      this.setState({ submitFlag: false });
    }
  };

  GoBack = () => {
    this.props.SaveAuthData({
      authNextPage                  : urls.LOGIN_ROUTE,
      checkLoginOrRegisterError     : false,
      checkLoginOrRegisterLoading   : false,
      checkLoginOrRegisterMsg       : false,
      checkLoginOrRegisterSuccess   : false,
      navigateToOtpSuccess          : false,
      navigateToResetPasswordSuccess: false,
    });
  };

  showEmailOrPhone = ()=>{
    return( 
      <CoreTypographyBody2 styleClasses={[CoreClasses.TEXT.TEXT_JUSTIFY]}>
        <CoreTypographyBody2 component="span">
          We have sent you a verification code on 
        </CoreTypographyBody2>

        <CoreTypographyBody2 
          component="span"
          limitChars={42}
          hideSeeMore={true}
          
        >
          {" " + maskEmailOrPhone(this.props.navData.emailOrPhone)}
        </CoreTypographyBody2>

        <CoreTypographyBody2 component="span">
          {`. Please enter the One Time Password (OTP) to verify your ${
            isNaN(this.props.navData.emailOrPhone) ? " email." : " phone."
          }`} 
        </CoreTypographyBody2>
      </CoreTypographyBody2>
    );
  };

  render() {
    if (
      !this.props.checkLoginOrRegisterSuccess &&
      (this.props.authNextPage !== urls.REGISTER_ROUTE ||
        this.props.authNextPage !== urls.RESET_PASSWORD_ROUTE)
    ) {
      return <CoreDomNavigate to={"/" + this.props.authNextPage} />;
    }

    return (
      <AuthContainer>
        <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
          {`Verify your${
            isNaN(this.props.navData.emailOrPhone) ? " email" : " phone"
          }`}
        </CoreH1>

        {this.props.authNextPage === urls.REGISTER_ROUTE ? (
          this.showEmailOrPhone()
        ) : (
          <>
            <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
              Reset Password through OTP
            </CoreTypographyBody1>

            {this.showEmailOrPhone()}
          </>
        )}

        <CoreBox
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}>
          <CoreTextButton OnClick={this.GoBack} label="Not You" />
        </CoreBox>

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithResetPassword"
          mode="edit"
          authenticated={false}
          initProps={{ otp: { to: this.props.navData.emailOrPhone } }}
        />

        {this.props.authNextPage === RoutesRegistry.REGISTER_ROUTE && (
          <CoreTypographyBody2>
            By signing up you agree to our{" "}

            <CoreLink
              styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}
              href={
                appConfig?.wrappid?.privacyLink ||
                "#"
              }>
              Privacy Policy
            </CoreLink>{" "}

            <CoreTypographyBody2 component="span">&</CoreTypographyBody2>{" "}

            <CoreLink
              styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}
              href={
                appConfig?.wrappid?.termsLink ||
                "#"
              }>
              Terms
            </CoreLink>

            {"."}
          </CoreTypographyBody2>
        )}
      </AuthContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth        : state.auth,
    authNextPage: state.auth.authNextPage,

    checkLoginOrRegisterError  : state.auth.checkLoginOrRegisterError,
    checkLoginOrRegisterLoading: state.auth.checkLoginOrRegisterLoading,
    checkLoginOrRegisterMsg    : state.auth.checkLoginOrRegisterMsg,
    checkLoginOrRegisterSuccess: state.auth.checkLoginOrRegisterSuccess,
    navData                    : state.auth.navData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    SaveAuthData: data => {
      dispatch(saveAuthData(data));
    },
    SendResetPasswordOtp: data => {
      dispatch(
        apiRequestAction(
          HTTP.POST,
          NAVIGATE_TO_RESET_PASSWORD_API,
          true,
          data,
          NAVIGATE_TO_RESET_PASSWORD_SUCCESS,
          CHECK_LOGIN_ERROR
        )
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterOrResetPassword);
