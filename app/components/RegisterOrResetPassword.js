import React, {Component} from 'react';

import {connect} from 'react-redux';

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
  HTTP,
  urls,
  config
} from "@wrappid/core"

import {
  CHECK_LOGIN_ERROR,
  NAVIGATE_TO_RESET_PASSWORD_API,
  NAVIGATE_TO_RESET_PASSWORD_SUCCESS,
} from '../types/authTypes';
import {AuthContainer} from './AuthContainer';
import {saveAuthData} from '../actions/authActions';

class RegisterOrResetPassword extends Component {
  state = {};

  componentDidMount = () => {
    if (
      this.props.authNextPage !== urls.REGISTER_ROUTE &&
      !this.props.navigateToResetPasswordLoading &&
      !this.props.navigateToResetPasswordSuccess
    ) {
      this.props.SendResetPasswordOtp({
        emailOrPhone: this.props?.navData?.emailOrPhone,
      });
    }
  };

  componentDidUpdate = () => {
    if (this.state.submitFlag && this.props.auth.authError) {
      //   swal("Oops!", this.props.auth.authError, "error");
      this.props.SaveAuthData({authError: null});
      this.setState({submitFlag: false});
    }
  };

  GoBack = () => {
    this.props.SaveAuthData({
      authNextPage: urls.LOGIN_ROUTE,
      checkLoginOrRegisterError: false,
      checkLoginOrRegisterLoading: false,
      checkLoginOrRegisterMsg: false,
      checkLoginOrRegisterSuccess: false,
      navigateToOtpSuccess: false,
      navigateToResetPasswordSuccess: false,
    });
  };

  render() {
    // console.log("props : ", this.props);
    // console.log("state : ", this.state);

    if (
      !this.props.checkLoginOrRegisterSuccess &&
      (this.props.authNextPage !== urls.REGISTER_ROUTE ||
        this.props.authNextPage !== urls.RESET_PASSWORD_ROUTE)
    ) {
      console.log('REDIRECT');
      return <CoreDomNavigate to={'/' + this.props.authNextPage} />;
    }

    return (
      <AuthContainer>
        <CoreH1 variant="h5" styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
          {`Verify your${
            isNaN(this.props.navData.emailOrPhone) ? ' email' : ' phone'
          }`}
        </CoreH1>

        {this.props.authNextPage === urls.REGISTER_ROUTE ? (
          <CoreTypographyBody2>
            {`We have sent you a verification code on ${maskEmailOrPhone(
              this.props.navData.emailOrPhone,
            )}.\nPlease enter the One Time Password (OTP) to verify your ${
              isNaN(this.props.navData.emailOrPhone) ? ' email.' : ' phone.'
            }`}
          </CoreTypographyBody2>
        ) : (
          <>
            <CoreTypographyBody1 styleClasses={[CoreClasses.TEXT.TEXT_CENTER]}>
              Reset Password through OTP
            </CoreTypographyBody1>

            <CoreTypographyBody2>
              {`We have sent you a verification code on your ${
                isNaN(this.props.navData.emailOrPhone) ? ' email' : ' phone'
              } ${maskEmailOrPhone(
                this.props.navData?.emailOrPhone,
              )}.\nPlease enter the One Time Password (OTP) to verify your ${
                isNaN(this.props.navData.emailOrPhone) ? ' email.' : ' phone.'
              }`}
            </CoreTypographyBody2>
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
        />

        {this.props.authNextPage === urls.REGISTER_ROUTE && (
          <CoreTypographyBody2>
            By signing up you agree to our{' '}
            <CoreLink
              styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}
              href={
                process.env?.REACT_APP_WRAPPID_privacyLink ||
                config?.wrappid?.privacyLink ||
                '#'
              }>
              Privacy Policy
            </CoreLink>{' '}
            <CoreTypographyBody2 component="span">&</CoreTypographyBody2>{' '}
            <CoreLink
              styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}
              href={
                process.env?.REACT_APP_WRAPPID_termsLink ||
                config?.wrappid?.termsLink ||
                '#'
              }>
              Terms
            </CoreLink>
            {'.'}
          </CoreTypographyBody2>
        )}
      </AuthContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    authNextPage: state.auth.authNextPage,

    checkLoginOrRegisterError: state.auth.checkLoginOrRegisterError,
    checkLoginOrRegisterLoading: state.auth.checkLoginOrRegisterLoading,
    checkLoginOrRegisterMsg: state.auth.checkLoginOrRegisterMsg,
    checkLoginOrRegisterSuccess: state.auth.checkLoginOrRegisterSuccess,
    navData: state.auth.navData,
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
          CHECK_LOGIN_ERROR,
        ),
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterOrResetPassword);
