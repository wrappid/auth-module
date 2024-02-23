import React, { useContext } from "react";

import {
  CoreBox,
  CoreSection,
  CoreImageBackground,
  CoreResourceContext,
  CoreImage,
  CoreThemeProvider,
  coreUseNavigate
} from "@wrappid/core";
import { useSelector } from "react-redux";

import ModuleClasses from "../styles/ModuleClasses";
import { AUTH_THEME } from "../theme/authTheme";

export const AuthContainer = props => {
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const requestUrl = useSelector(state => state?.manageAssistant?.requestUrl);
  const resourceContext = useContext(CoreResourceContext);
  const logo = resourceContext?.appLogoLight;
  const authBackground = resourceContext?.authBackground;

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
      <CoreImageBackground
        source={authBackground}
        resizeMode="cover"
        styleClasses={[ModuleClasses?.ALIGNMENT?.JUSTIFY_CONTENT_CENTER]}>
        <CoreBox styleClasses={[ModuleClasses?.AUTH?.WRAPPER, ModuleClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
          <CoreSection
            elevated={false}
            styleClasses={[
              ModuleClasses?.UTILS?.FIT_CONTENT_WIDTH,
              ModuleClasses?.UTILS?.FIT_CONTENT_HEIGHT,
              ModuleClasses?.AUTH?.CARD_MIN_WIDTH,
              ModuleClasses?.AUTH?.CARD_MAX_WIDTH,
              ModuleClasses?.AUTH?.CARD
            ]}>
            <CoreBox
              styleClasses={[ModuleClasses?.LAYOUT?.FULL_WIDTH, ModuleClasses?.ALIGNMENT?.ALIGN_ITEMS_CENTER, ModuleClasses?.ALIGNMENT?.JUSTIFY_CONTENT_CENTER, ModuleClasses?.MARGIN?.MB5]}>
              {logo && (
                <CoreImage
                  src={logo}
                  styleClasses={[ModuleClasses?.AUTH?.LOGO]}
                />
              )}
            </CoreBox>

            {props.children}
          </CoreSection>
        </CoreBox>
      </CoreImageBackground>
    </CoreThemeProvider>
  );
};
