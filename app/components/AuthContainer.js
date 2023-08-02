import React, {useContext} from 'react';
import {useSelector} from 'react-redux';

import {
  CoreBox,
  CoreSection,
  CoreClasses,
  CoreImageBackground,
  CoreResourceContext,
  CoreImage,
  CoreThemeProvider,
  coreUseNavigate
} from "@wrappid/core"


import { AUTH_THEME } from './authTheme';

export const AuthContainer = props => {
  const navigate = coreUseNavigate();
  const auth = useSelector(state => state.auth);
  const requestUrl = useSelector(state => state?.manageAssistant?.requestUrl);
  const resourceContext = useContext(CoreResourceContext);
  const logo = resourceContext?.appLogo;
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

        navigate('/', {state: {recalledPath: path}});
      } else {
        navigate('/');
      }
    }
  });
  return (
      <CoreThemeProvider theme={AUTH_THEME}>
        <CoreImageBackground
          source={authBackground}
          resizeMode="cover">
          <CoreBox styleClasses={[CoreClasses?.AUTH?.WRAPPER]}>
              <CoreSection
                elevated={false}
                styleClasses={[
                  CoreClasses?.UTILS?.FIT_CONTENT_WIDTH,
                  CoreClasses?.UTILS?.FIT_CONTENT_HEIGHT,
                  CoreClasses?.AUTH?.CARD_MIN_WIDTH,
                  CoreClasses?.AUTH?.CARD_MAX_WIDTH,
                  CoreClasses?.AUTH?.CARD
                ]}>
                <CoreBox
                  styleClasses={[
                    CoreClasses?.LAYOUT?.FULL_WIDTH,
                    CoreClasses?.ALIGNMENT?.ALIGN_ITEMS_CENTER,
                    CoreClasses?.ALIGNMENT?.JUSTIFY_CONTENT_CENTER,
                    CoreClasses?.MARGIN?.MB5,
                  ]}>
                  {/* <CoreComponent componentName="AppLogo" /> */}
                  {logo && (
                    <CoreImage
                      src={logo}
                      styleClasses={[CoreClasses?.AUTH?.LOGO]}
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
