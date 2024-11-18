import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreImage,
  CoreImageBackground,
  CoreLayoutPlaceholder,
  CoreResourceContext,
  CoreTypographyBody1,
  coreUseLocation,
  coreUseNavigate
} from "@wrappid/core";
import { WrappidContext } from "@wrappid/styles";
import { useSelector } from "react-redux";

// eslint-disable-next-line import/order
import AuthCustomFooter from "./AuthCustomFooter";
import ModuleClasses from "../../styles/ModuleClasses";

export default function AuthLayout() {
  let appName = WrappidContext.config.packageInfo.name || "app-name";
  
  let { pathname: currentPage } = coreUseLocation();

  const navigate = coreUseNavigate();
  const resourceContext = React.useContext(CoreResourceContext);
  const { authNextPage } = useSelector((state) => state.auth);

  const authBackground = resourceContext?.authBackground;

  React.useEffect(() => {
    let currPage = currentPage?.toLowerCase();
    let authPage = authNextPage?.toLowerCase();

    if (authPage && !currPage?.includes(authPage)) {
      navigate(`${authNextPage}`);
    }
  }, [authNextPage]);

  return (
    <>
      <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[CoreClasses.HEIGHT.MIN_VH_100, CoreClasses.OVERFLOW.OVERFLOW_HIDDEN]}
      >
        <CoreBox styleClasses={[ModuleClasses.AUTH.CONTENT]}>
          <CoreLayoutPlaceholder
            styleClasses={[ModuleClasses.AUTH.CONTENT_BOX]}
            key="authlayoutplaceholder"
            id={AuthLayout.PLACEHOLDER.CONTENT}
          >
            <CoreBox
              styleClasses={[CoreClasses.MARGIN.MB5, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.FLEX.DIRECTION_ROW]}
            >
              {resourceContext?.appLogo ? (
                <CoreImage
                  width={130}
                  height={40}
                  src={resourceContext.appLogo}
                  alt="Logo"
                />
              ) : (
                <CoreTypographyBody1>{appName}</CoreTypographyBody1>
              )}
            </CoreBox>
          </CoreLayoutPlaceholder>
        </CoreBox>

        <AuthCustomFooter key="authlayoutfooter" />
      </CoreImageBackground>
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };
