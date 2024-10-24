/* eslint-disable etc/no-commented-out-code */
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React, { useContext } from "react";

import {
  CoreBox, CoreClasses, CoreGrid, CoreImage, CoreImageBackground, CoreLayoutPlaceholder, CoreResourceContext, CoreTypographyBody1,
  coreUseLocation,
  coreUseNavigate
} from "@wrappid/core";
import { useSelector } from "react-redux";

// eslint-disable-next-line import/order
import AuthCustomFooter from "./AuthCustomFooter";
import ModuleClasses from "../../styles/ModuleClasses";

export default function AuthLayout() {
  let { pathname: currentPage } = coreUseLocation();

  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const {
    // checkLoginOrRegisterSuccess,
    authNextPage,
    // navData,
    // uid,
    // accessToken
  } = auth;
  /**
   * @todo
   * commented code will help us handle redirect url post login
   */
  // eslint-disable-next-line etc/no-commented-out-code
  // const navigate = coreUseNavigate();
  // const {
  //   uid,
  //   sessionExpired,
  //   sessionDetail,
  //   accessToken,
  //   refreshToken
  // } = useSelector(state => state.auth);
  // const { redirectUrl } = useSelector(state => state.app);
  const resourceContext = useContext(CoreResourceContext);
  const authBackground = resourceContext?.authBackground;

  // React.useEffect(() => {
  //   if (uid) {
  //     if (redirectUrl) {
  //       navigate(redirectUrl);
  //     } else if (
  //       sessionExpired &&
  //       sessionDetail &&
  //       accessToken &&
  //       refreshToken
  //     ) {
  //       let path = sessionDetail?.location?.pathname;

  //       navigate("/", { state: { recalledPath: path } });
  //     }
  //   }
  // }, [
  //   uid,
  //   redirectUrl,
  //   sessionExpired,
  //   sessionDetail,
  //   accessToken,
  //   refreshToken
  // ]);

  React.useEffect(() => {
    let currPage = currentPage.toLowerCase();
    let authPage = authNextPage.toLowerCase();

    if(!currPage.includes(authPage)){
      /**
       * @todo
       * Call getProfileBasic here, not working
       */
      navigate(`/${authNextPage}`);
    }

  }, [authNextPage]);

  return (
    <>
      <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[CoreClasses.HEIGHT.VH_100, CoreClasses.OVERFLOW.OVERFLOW_HIDDEN]}>

        <CoreGrid styleClasses={
          [ModuleClasses.AUTH.CONTENT]
        }>
          <CoreLayoutPlaceholder
            gridProps={{ gridSize: { md: 3, sm: 6 } }}
            key="authlayoutplaceholder"
            id={AuthLayout.PLACEHOLDER.CONTENT}
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
        </CoreGrid>

        <AuthCustomFooter key="authlayoutfooter" />
      </CoreImageBackground>
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };