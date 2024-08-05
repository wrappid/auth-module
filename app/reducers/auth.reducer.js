import { ModuleRoute } from "../constants/app.constants";
import {
  AUTH_DATA_SAVED,
  AUTH_LOADING,
  GET_PROFILE_BASIC_SUCCESS,
  CHECK_LOGIN_ERROR,
  CHECK_LOGIN_LOADING,
  CHECK_LOGIN_SUCCESS_REGISTERED,
  CHECK_LOGIN_SUCCESS_UNREGISTERED,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  REGISTER_ACCOUNT_SUCCESS,
  SAVE_EXPIRED_SESSION,
  SAVE_NAV_DATA,
  SESSION_EXPIRED,
  SESSION_RECALLED,
  SAVE_DEFAULT
} from "../types/auth.types";

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

  registerError       : false,
  registerLoading     : false,
  registerRequestError: false,

  registerRequestLoading: false,
  registerRequestSuccess: false,
  registerSuccess       : false,
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

    case REGISTER_ACCOUNT_SUCCESS:
      return {
        ...state,
        accessToken                : action.payload.accessToken,
        authError                  : null,
        authLoading                : false,
        authNextPage               : "/",
        checkLoginOrRegisterSuccess: true,
        refreshToken               : action.payload.refreshToken,
        registerSuccess            : true,
        uid                        : action.payload.id,
        user                       : action.payload,
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
        authNextPage               : ModuleRoute.PASSWORD_ROUTE,
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

    case SAVE_DEFAULT:
      return {
        ...state,
        defaultData: action.data,
      };
  }

};

export default authReducer;
