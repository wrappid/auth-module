import { CoreBox, CoreClasses, CoreTextButton } from "@wrappid/core";
import { useDispatch } from "react-redux";

import { saveAuthData } from "../../actions/authActions";
import { ModuleRoute } from "../../constants/app.constants";
import { RESET_AUTH_STATE } from "../../types/authTypes";

export default function NotYouButton() {
  const dispatch = useDispatch();

  const GoBack = () => {
    dispatch({ type: RESET_AUTH_STATE });
    dispatch(saveAuthData({ authNextPage: ModuleRoute.LOGIN_ROUTE }));
  };

  return (
    <CoreBox
      styleClasses={[CoreClasses.TEXT.TEXT_CENTER, CoreClasses.MARGIN.MB1]}
    >
      <CoreTextButton onClick={GoBack} label="Not you ?" />
    </CoreBox>
  );
}
