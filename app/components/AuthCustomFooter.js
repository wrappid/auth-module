import { CoreBox, CoreClasses, CoreLink, CoreStack, CoreTypographyBody1 } from "@wrappid/core";

export default function AuthCustomFooter() {
  return (
    <CoreBox styleClasses={[CoreClasses.PADDING.PX_1, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_SPACE_BETWEEN]}>
      <CoreTypographyBody1>v.0.0.1</CoreTypographyBody1>

      <CoreStack>
        <CoreLink>Help</CoreLink>

        <CoreLink>Privacy</CoreLink>

        <CoreLink>Terms</CoreLink>
      </CoreStack>
    </CoreBox>
  );
}
