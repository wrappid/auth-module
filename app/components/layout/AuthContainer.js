import React, { useContext } from "react";

import {
  CoreBox,
  CoreSection,
  CoreResourceContext,
  CoreImage,
  CoreThemeProvider,
  coreUseNavigate,
  CoreClasses
} from "@wrappid/core";
import { useSelector } from "react-redux";

import ModuleClasses from "../../styles/ModuleClasses";
import { AUTH_THEME } from "../../theme/authTheme";

export const AuthContainer = props => {
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const requestUrl = useSelector(state => state?.manageAssistant?.requestUrl);
  const resourceContext = useContext(CoreResourceContext);
  const logo = resourceContext?.appLogoLight;

  React.useEffect(() => {
    if (auth.uid) {
      if (requestUrl) {
        navigate(requestUrl.requestUrl);
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
  });
  return (
    <CoreThemeProvider theme={AUTH_THEME}>
      {/* <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[CoreClasses?.ALIGNMENT?.JUSTIFY_CONTENT_CENTER]}>
        <CoreBox styleClasses={[ModuleClasses?.AUTH?.WRAPPER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.BG.BG_SECONDARY]}>*/}
      <CoreSection
        elevated={false}
        styleClasses={[ModuleClasses?.AUTH?.CARD_MIN_WIDTH, ModuleClasses?.AUTH?.CARD_MAX_WIDTH, ModuleClasses?.AUTH?.CARD]}>
        <CoreBox
          styleClasses={[ModuleClasses?.LAYOUT?.FULL_WIDTH, CoreClasses.ALIGNMENT.ALIGN_ITEMS_CENTER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.MARGIN.MB5]}>
          {logo && (
            <CoreImage
              src={logo}
              styleClasses={[ModuleClasses?.AUTH?.LOGO]}
            />
          )}
        </CoreBox>

        {props.children}
      </CoreSection>

      {/*</CoreBox>

      </CoreImageBackground> */}
    </CoreThemeProvider>
  );
};
