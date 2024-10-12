import { ModuleRoute } from "../constants/app.constants";
import {
  ADD_USER_ERROR,
  ADD_USER_LOADING,
  ADD_USER_SUCCESS,
  AUTHENTICATION_ERROR,
  AUTH_DATA_SAVED,
  AUTH_LOADING,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD_LOADING,
  CHANGE_PASSWORD_SUCCESS,
  CHECK_LOGIN_ERROR,
  CHECK_LOGIN_LOADING,
  CHECK_LOGIN_SUCCESS_REGISTERED,
  CHECK_LOGIN_SUCCESS_UNREGISTERED,
  CLIENT_INFORMATION_FETCH_ERROR,
  CLIENT_INFORMATION_FETCH_SUCCESS,
  GET_PROFILE_BASIC_SUCCESS,
  GET_ROLE_PERMISSION_ERROR,
  GET_ROLE_PERMISSION_LOADING,
  GET_ROLE_PERMISSION_SUCCESS,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT_ERROR,
  LOGOUT_LOADING,
  LOGOUT_SUCCESS,
  NAVIGATE_TO_OTP_LOGIN_LOADING,
  NAVIGATE_TO_OTP_LOGIN_SUCCESS,
  NAVIGATE_TO_RESET_PASSWORD_SUCCESS,
  RESET_CHANGE_PASSWORD_STATUS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESS,
  SAVE_DEFAULT,
  SAVE_EXPIRED_SESSION,
  SAVE_NAV_DATA,
  SESSION_EXPIRED,
  SESSION_RECALLED,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  TOKEN_REFRESH_SUCCESS
} from "../types/authTypes";

const initState = {
  accessToken: null,
  authError  : null,
  authLoading: false,

  authNextPage       : ModuleRoute.LOGIN_ROUTE,
  changePasswordError: false,

  changePasswordLoading: false,
  changePasswordSuccess: false,
  checkLoginOrRegister : null,

  checkLoginOrRegisterError  : false,
  checkLoginOrRegisterLoading: false,
  checkLoginOrRegisterMsg    : null,
  checkLoginOrRegisterOtp    : false,
  checkLoginOrRegisterSuccess: false,
  checkSignup                : false,
  clientLoginFlag            : false,
  clientLoginInformation     : null,

  loginPage    : null,
  logoutLoading: false,
  name         : "",

  navData                       : {},
  navigateToOtpError            : false,
  navigateToOtpLoading          : false,
  navigateToOtpMsg              : false,
  navigateToOtpSuccess          : false,
  navigateToResetPasswordError  : false,
  navigateToResetPasswordLoading: false,

  navigateToResetPasswordMsg: false,

  navigateToResetPasswordSuccess: false,
  permissions                   : null,
  photo                         : null,
  refreshToken                  : null,

  registerRequestError  : false,
  registerRequestLoading: false,
  registerRequestSuccess: false,
  resetPasswordError    : false,

  resetPasswordLoading: false,
  resetPasswordSuccess: false,

  role                  : null,
  rolePermissionsError  : false,
  rolePermissionsLoading: false,
  rolePermissionsMsg    : false,
  rolePermissionsSuccess: false,
  user                  : null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        authError  : null,
        authLoading: true,
      };

    case LOGIN_ERROR:
      return {
        ...state,
        authError: action.message
          ? "Login failed due to " + String(action.message).toLowerCase()
          : "Login Failed",
        authLoading: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        accessToken                : action.payload.accessToken,
        authError                  : null,
        authLoading                : false,
        authNextPage               : "/",
        checkLoginOrRegisterSuccess: true,
        refreshToken               : action.payload.refreshToken,
        uid                        : action.payload.id,
        user                       : action.payload,
      };

    case TOKEN_REFRESH_SUCCESS:
      // //console.log("REDU:", action.payload.accessToken, action.payload.refreshToken );
      return {
        ...state,
        accessToken: action.payload.accessToken,
        authError  : null,
        authLoading: false,
      };

    case AUTHENTICATION_ERROR:
      return initState;

    case LOGOUT_LOADING:
      return {
        ...state,
        logoutLoading: true,
      };

    case LOGOUT_SUCCESS:
      return initState;

    case LOGOUT_ERROR:
      return initState;

    case SIGNUP_ERROR:
      return {
        ...state,
        authError: action.error.message,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        authError: null,
      };

    case RESET_PASSWORD_LOADING:
      return {
        ...state,
        resetPasswordError  : false,
        resetPasswordLoading: true,
        resetPasswordSuccess: false,
      };

    case RESET_PASSWORD_SUCCESS:
      alert("Password reset successfuly. Check your mail.");
      return {
        ...state,
        resetPasswordError  : false,
        resetPasswordLoading: false,
        resetPasswordSuccess: true,
      };

    case RESET_PASSWORD_ERROR:
      alert("Password reset error...");
      return {
        ...state,
        resetPasswordError  : true,
        resetPasswordLoading: false,
        resetPasswordSuccess: false,
      };

    case CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        changePasswordError  : false,
        changePasswordLoading: true,
        changePasswordSuccess: false,
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordError  : false,
        changePasswordLoading: false,
        changePasswordSuccess: true,
      };

    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        changePasswordError  : true,
        changePasswordLoading: false,
        changePasswordSuccess: false,
      };

    case RESET_CHANGE_PASSWORD_STATUS:
      return {
        ...state,
        changePasswordError  : false,
        changePasswordLoading: false,
        changePasswordSuccess: false,
      };

    case ADD_USER_LOADING:
      return {
        ...state,
        signUpError  : false,
        signUpLoading: true,
        signUpMessage: null,
        signUpSuccess: false,
      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        signUpError  : false,
        signUpLoading: false,
        signUpMessage: action.message,
        signUpSuccess: true,
      };

    case ADD_USER_ERROR:
      return {
        ...state,
        signUpError  : true,
        signUpLoading: false,
        signUpMessage: action.message,
        signUpSuccess: false,
      };

    case SAVE_DEFAULT:
      return {
        ...state,
        defaultData: action.data,
      };

    case CHECK_LOGIN_LOADING:
      return {
        ...state,
        checkLoginOrRegister       : null,
        checkLoginOrRegisterError  : false,
        checkLoginOrRegisterLoading: true,
        checkLoginOrRegisterMsg    : null,
        checkLoginOrRegisterSuccess: false,
      };

    case CHECK_LOGIN_SUCCESS_REGISTERED:
      return {
        ...state,
        authNextPage               : ModuleRoute.PASSWORD_ROUTE,
        checkLoginOrRegisterError  : false,
        checkLoginOrRegisterLoading: false,
        checkLoginOrRegisterMsg    : null,
        checkLoginOrRegisterSuccess: true,
        name                       : action.payload.data.name,
        photo                      : action.payload.data.photoUrl,
      };

    case CHECK_LOGIN_SUCCESS_UNREGISTERED:
      return {
        ...state,
        authNextPage               : ModuleRoute.REGISTER_ROUTE,
        checkLoginOrRegisterError  : false,
        checkLoginOrRegisterLoading: false,
        checkLoginOrRegisterMsg    : action.message,
        checkLoginOrRegisterSuccess: true,
      };

    case NAVIGATE_TO_OTP_LOGIN_LOADING:
      return {
        ...state,
        navigateToOtpError  : false,
        navigateToOtpLoading: true,
        navigateToOtpSuccess: false,
      };

    case NAVIGATE_TO_OTP_LOGIN_SUCCESS:
      return {
        ...state,
        authNextPage        : ModuleRoute.LOGIN_OTP_ROUTE,
        navigateToOtpError  : false,
        navigateToOtpLoading: false,
        navigateToOtpMsg    : action.message,
        navigateToOtpSuccess: true,
      };

    case NAVIGATE_TO_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        authNextPage                  : ModuleRoute.RESET_PASSWORD_ROUTE,
        navigateToResetPasswordError  : false,
        navigateToResetPasswordLoading: false,
        navigateToResetPasswordMsg    : action.message,
        navigateToResetPasswordSuccess: true,
      };

    case GET_ROLE_PERMISSION_LOADING:
      return {
        ...state,
        permissions           : null,
        role                  : null,
        rolePermissionsError  : false,
        rolePermissionsLoading: true,
        rolePermissionsMsg    : action.message,
        rolePermissionsSuccess: false,
      };

    case GET_ROLE_PERMISSION_SUCCESS:
      return {
        ...state,
        permissions           : action.payload?.data?.permissions,
        role                  : action.payload?.data?.role,
        rolePermissionsError  : false,
        rolePermissionsLoading: false,
        rolePermissionsMsg    : action.payload.message,
        rolePermissionsSuccess: true,
      };

    case GET_ROLE_PERMISSION_ERROR:
      return {
        ...state,
        permissions           : null,
        role                  : null,
        rolePermissionsError  : true,
        rolePermissionsLoading: false,
        rolePermissionsMsg    : action.message,
        rolePermissionsSuccess: false,
      };

    case CHECK_LOGIN_ERROR:
      return {
        ...state,
        checkLoginOrRegister       : null,
        checkLoginOrRegisterError  : true,
        checkLoginOrRegisterLoading: false,
        checkLoginOrRegisterMsg    : action.message,
        checkLoginOrRegisterSuccess: false,
      };

    case GET_PROFILE_BASIC_SUCCESS:
      return {
        ...state,
        photo: action?.payload?.data?.data?.photoUrl,
      };

    case SAVE_NAV_DATA:
      return {
        ...state,
        navData: action.payload,
      };

    case SESSION_EXPIRED: {
      return {
        ...state,
        accessToken                : null,
        authNextPage               : ModuleRoute.LOGIN_ROUTE,
        checkLoginOrRegisterSuccess: true,
        loginPage                  : null,
        refreshToken               : null,
        sessionDetail              : null,
        sessionExpired             : true,
      };
    }

    case SAVE_EXPIRED_SESSION: {
      return {
        ...state,
        sessionDetail: action.payload,
        uid          : null,
      };
    }

    case SESSION_RECALLED: {
      return {
        ...state,
        sessionDetail : null,
        sessionExpired: false,
      };
    }

    case AUTH_DATA_SAVED:
      return {
        ...state,
        ...action.data,
      };

    case CLIENT_INFORMATION_FETCH_SUCCESS:
      return {
        ...state,
        clientLoginFlag       : true,
        clientLoginInformation: action.payload,
      };

    case CLIENT_INFORMATION_FETCH_ERROR:
      return {
        ...state,
        clientLoginFlag       : false,
        clientLoginInformation: null,
      };

    default:
      return state;
  }
};

export default authReducer;
