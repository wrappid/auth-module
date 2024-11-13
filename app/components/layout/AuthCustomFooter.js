import React from "react";

import { CoreBox, CoreClasses, CoreLink, CoreTypographyBody1 } from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";

import ModuleClasses from "../../styles/ModuleClasses";

export default function AuthCustomFooter() {
  const { config: appConfig } = React.useContext(WrappidDataContext);

  return (
    <CoreBox
      coreId="authFooter"
      styleClasses={[ModuleClasses.AUTH.FOOTER]}>
      <CoreBox styleClasses={[CoreClasses.PADDING.PB2]}>
        <CoreTypographyBody1 gutterBottom={false} paragraph={false} styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>{appConfig.packageInfo.version}</CoreTypographyBody1>
      </CoreBox>

      <CoreBox styleClasses={[CoreClasses.FLEX.DIRECTION_ROW, CoreClasses.PADDING.PB2]}>
        <CoreLink
          href={
            appConfig?.wrappid?.helpLink ||
          "#"
          }
          styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY]}>Help</CoreLink>

        <CoreLink
          href={
            appConfig?.wrappid?.privacyLink ||
          "#"
          }
          styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PL2]}>Privacy</CoreLink>

        <CoreLink
          href={
            appConfig?.wrappid?.termsLink ||
          "#"
          }
          styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PL2]}>Terms</CoreLink>
      </CoreBox>
    </CoreBox>
  );
}
