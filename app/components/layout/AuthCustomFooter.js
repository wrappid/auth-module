import { CoreBox, CoreClasses, CoreGrid, CoreLink, CoreTypographyBody1 } from "@wrappid/core";

import ModuleClasses from "../../styles/ModuleClasses";

export default function AuthCustomFooter() {
  return (
    <CoreBox>
      <CoreGrid
        coreId="authFooterGrid"
        styleClasses={[ModuleClasses.AUTH.FOOTER]}>
        <CoreBox gridProps={{ gridSize: 6 }}>
          <CoreTypographyBody1 styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}>v.0.0.1</CoreTypographyBody1>
        </CoreBox>

        <CoreBox gridProps={{ gridSize: 6 }} styleClasses={[CoreClasses.TEXT.TEXT_END]}>
          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Help</CoreLink>

          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Privacy</CoreLink>

          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Terms</CoreLink>
        </CoreBox>
      </CoreGrid>
    </CoreBox>
  );
}
