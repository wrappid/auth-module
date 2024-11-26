import {
  CoreAvatar,
  CoreBox,
  CoreClasses,
  CoreForm,
  CoreLayoutItem,
  CoreTextButton,
  CoreTypographyBody1,
  CoreTypographyBody2,
  stringUtils
} from "@wrappid/core";
import { useDispatch, useSelector } from "react-redux";

import NotYouButton from "./common/NotYouButton";
import AuthLayout from "./layout/AuthLayout";
import { saveAuthData } from "../actions/authActions";
import { ModuleRoute } from "../constants/app.constants";

const LoginWithPassword = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const {
    identifier,
    navData:{
      name,
      photo,
    }
  } = auth;

  const changeAuthNextPage = (routeName) => {
    dispatch(saveAuthData({ authNextPage: routeName }));
  };

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        <CoreBox
          styleClasses={[CoreClasses.DISPLAY.FLEX, CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.MARGIN.MB3]}
        >
          <CoreAvatar
            styleClasses={[CoreClasses.DATA_DISPLAY.AVATAR_LARGE]}
            src={photo ? photo : "photo.jpg"}
          />
        </CoreBox>

        <CoreTypographyBody1
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1, CoreClasses.COLOR.TEXT_PRIMARY]}
        >
          {name && name?.trim() !== "" ? name : "Unknown User"}
        </CoreTypographyBody1>

        <CoreTypographyBody2
          limitChars={42}
          hideSeeMore={true}
          styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.COLOR.TEXT_PRIMARY]}
        >
          {stringUtils.maskEmailOrPhone(
            identifier
          )}
        </CoreTypographyBody2>

        <NotYouButton />

        <CoreForm
          styleClasses={CoreClasses.LAYOUT.AUTH_FORM_CONTAINER}
          formId="loginWithPassword"
          mode="edit"
          authenticated={false}
        />

        <CoreBox
          styleClasses={[
            CoreClasses.LAYOUT.FULL_WIDTH,
            CoreClasses.DISPLAY.FLEX,
            CoreClasses.FLEX.DIRECTION_ROW,
            CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_SPACE_BETWEEN,
            CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER,
            CoreClasses.MARGIN.MT3,
          ]}
        >
          <CoreTextButton
            styleClasses={[CoreClasses.MARGIN.ML0, CoreClasses.PADDING.P0]}
            onClick={() => changeAuthNextPage(ModuleRoute.RESET_PASSWORD_ROUTE)}>
            Reset Password
          </CoreTextButton>

          <CoreTextButton
            styleClasses={[CoreClasses.MARGIN.ML0, CoreClasses.PADDING.P0]}
            onClick={() => changeAuthNextPage(ModuleRoute.LOGIN_OTP_ROUTE)}>
            Login with OTP
          </CoreTextButton>
        </CoreBox>

      </CoreLayoutItem>
    </>
  );
};

export default LoginWithPassword;
