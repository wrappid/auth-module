import {
  CoreBox, CoreClasses, CoreLink, CoreTypographyBody1, CoreGrid, CoreContainer 
} from "@wrappid/core";

export default function AuthCustomFooter() {
  return (
    <CoreContainer maxWidth="xl">
      <CoreGrid
        coreId="authFooterGrid"
        styleClasses={[CoreClasses.BG.BG_TRANSPARENT, CoreClasses.DISPLAY.FLEX, CoreClasses.ALIGNMENT.ALIGN_CONTENT_CENTER, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_SPACE_BETWEEN]}>
        <CoreBox gridProps={{ gridSize: 6 }}>
          <CoreTypographyBody1 styleClasses={[CoreClasses.COLOR.TEXT_WHITE]}>v.0.0.1</CoreTypographyBody1>
        </CoreBox>

        <CoreBox gridProps={{ gridSize: 6 }} styleClasses={[CoreClasses.TEXT.TEXT_END]}>
          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Help</CoreLink>

          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Privacy</CoreLink>

          <CoreLink styleClasses={[CoreClasses.COLOR.TEXT_WHITE, CoreClasses.PADDING.PL1]}>Terms</CoreLink>
        </CoreBox>
      </CoreGrid>
    </CoreContainer>
  );
}
