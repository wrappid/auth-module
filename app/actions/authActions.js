import { LOGOUT_SUCCESS, SAVE_NAV_DATA } from "../types/authTypes";

export const saveData = (body) => {
  return (dispatch) => {
    dispatch({
      payload: body,
      type   : SAVE_NAV_DATA,
    });
  };
};

export const saveAuthData = (body) => {
  return (dispatch) => {
    dispatch({
      data: body,
      type: "AUTH_DATA_SAVED",
    });
  };
};

export const clearAuthState = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT_SUCCESS });
  };
};
