import React from "react";

import { CoreBox, CoreClasses, CoreGrid, CoreLink, CoreTypographyBody1 } from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";

import ModuleClasses from "../../styles/ModuleClasses";

export default function AuthCustomFooter() {
  const { config: appConfig } = React.useContext(WrappidDataContext);

  return (
    <CoreBox>
      <CoreGrid
        coreId="authFooterGrid"
        styleClasses={[ModuleClasses.AUTH.FOOTER]}>
        <CoreBox gridProps={{ gridSize: 6 }}>
          <CoreTypographyBody1 styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>{appConfig.packageInfo.version}</CoreTypographyBody1>
        </CoreBox>

        <CoreBox gridProps={{ gridSize: 6 }} styleClasses={[CoreClasses.TEXT.TEXT_END]}>
          <CoreLink
            href={
              appConfig?.wrappid?.helpLink ||
            "#"
            }
            styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PL1]}>Help</CoreLink>

          <CoreLink
            href={
              appConfig?.wrappid?.privacyLink ||
            "#"
            }
            styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PL1]}>Privacy</CoreLink>

          <CoreLink
            href={
              appConfig?.wrappid?.termsLink ||
            "#"
            }
            styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PL1]}>Terms</CoreLink>
        </CoreBox>
      </CoreGrid>
    </CoreBox>
  );
}
