// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React, { useContext } from "react";

import {
  CoreBox, CoreClasses, CoreImage, CoreImageBackground, CoreLayoutPlaceholder, CoreResourceContext, CoreTypographyBody1, coreUseNavigate
} from "@wrappid/core";
import { useSelector } from "react-redux";

import ModuleClasses from "../../styles/ModuleClasses";
// eslint-disable-next-line import/order
import AuthCustomFooter from "./AuthCustomFooter";

export default function AuthLayout() {
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const { redirectUrl } = useSelector(state=>state.app);
  const resourceContext = useContext(CoreResourceContext);
  const authBackground = resourceContext?.authBackground;

  if (auth?.uid) {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (
      auth.sessionExpired &&
      auth.sessionDetail &&
      auth.accessToken &&
      auth.refreshToken
    ) {
      let path = auth.sessionDetail?.location?.pathname;

      navigate("/", { state: { recalledPath: path } });
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[CoreClasses.HEIGHT.VH_100]}>

        <CoreBox
          styleClasses={
            [
              CoreClasses.HEIGHT.VH_100,
              CoreClasses.DISPLAY.FLEX,
              CoreClasses.FLEX.DIRECTION_COLUMN,
              CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER,
              CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER,
            ]
          }
        >
          <CoreLayoutPlaceholder
            key="authlayoutplaceholder"
            id={AuthLayout.PLACEHOLDER.CONTENT}
            styleClasses={[ModuleClasses.AUTH.CONATINER]}
          >
            <CoreBox styleClasses={[CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.MARGIN.MB2]}>
              {resourceContext?.appLogo ?
                <CoreImage
                  width={100}
                  src={resourceContext.appLogo}
                  alt="Logo" />
                : <CoreTypographyBody1>{ }</CoreTypographyBody1>}
            </CoreBox>
          </CoreLayoutPlaceholder>
        </CoreBox>

        <AuthCustomFooter key="authlayoutfooter" />
      </CoreImageBackground>
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };
