// eslint-disable-next-line import/no-unresolved
import { DefaultCoreStyles } from "@wrappid/core";
import { DefaultUtilityStyles } from "@wrappid/styles";

export default class DefaultModuleStyles extends DefaultCoreStyles {
  defaultUtilityStyles = new DefaultUtilityStyles().style;

  constructor() {
    super();
    this.style = {
      authContent: {
        ...this.defaultUtilityStyles.justifyContentCenter,
        ...this.defaultUtilityStyles.alignItemsCenter,
        height: "90vh"
      },
      authFooter: {
        ...this.defaultUtilityStyles.p1,
        ...this.defaultUtilityStyles.bgTransparent,
        ...this.defaultUtilityStyles.displayFlex,
        ...this.defaultUtilityStyles.alignContentEnd,
        ...this.defaultUtilityStyles.justifyContentSpaceBetween,
        height: "10vh"
      }
    };
  }
}
