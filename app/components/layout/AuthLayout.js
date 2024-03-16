// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React, { useContext } from "react";

import {
  CoreBox, CoreClasses, CoreImage, CoreImageBackground, CoreLayoutPlaceholder, CoreResourceContext
} from "@wrappid/core";

import ModuleClasses from "../../styles/ModuleClasses";
// eslint-disable-next-line import/order
import AuthCustomFooter from "./AuthCustomFooter";

export default function AuthLayout() {
  const resourceContext = useContext(CoreResourceContext);
  const authBackground = resourceContext?.authBackground;

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
              <CoreImage width={100} src={resourceContext.appLogo} alt="logo" />
            </CoreBox>
          </CoreLayoutPlaceholder>
        </CoreBox>

        <AuthCustomFooter key="authlayoutfooter" />
      </CoreImageBackground>
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };
