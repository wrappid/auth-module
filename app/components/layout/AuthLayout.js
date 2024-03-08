// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React, { useContext } from "react";

import { CoreLayoutPlaceholder, CoreClasses, CoreImageBackground, CoreResourceContext, CoreH6 } from "@wrappid/core";

import AuthCustomFooter from "../AuthCustomFooter";

export default function AuthLayout() {
  const resourceContext = useContext(CoreResourceContext);
  const authBackground = resourceContext?.authBackground;

  return (
    <>
      <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[CoreClasses.HEIGHT.VH_100]}>
          
        <CoreLayoutPlaceholder
          key="authlayoutplaceholder"
          id={AuthLayout.PLACEHOLDER.CONTENT}
          styleClasses={
            [
              CoreClasses.HEIGHT.VH_100,
              CoreClasses.DISPLAY.FLEX,
              CoreClasses.FLEX.DIRECTION_COLUMN,
              CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER,
              CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER,
              CoreClasses.BG.BG_SECONDARY_DARK
            ]
          } />

        <CoreH6>
            Hello World!
        </CoreH6>

        <AuthCustomFooter key="authlayoutfooter" />
      </CoreImageBackground>
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };
