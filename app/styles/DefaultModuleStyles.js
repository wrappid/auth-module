// eslint-disable-next-line import/no-unresolved
import { DefaultCoreStyles } from "@wrappid/core";
import { DefaultUtilityStyles, IMPORTANT } from "@wrappid/styles";

export default class DefaultModuleStyles extends DefaultCoreStyles {
  defaultUtilityStyles = new DefaultUtilityStyles().style;

  constructor() {
    super();
    this.style = {
      authContent: {
        ...this.defaultUtilityStyles.displayFlex,
        ...this.defaultUtilityStyles.justifyContentCenter,
        ...this.defaultUtilityStyles.alignItemsCenter,
        minHeight: "90vh",
      },
      authContentBox: {
        maxWidth: "75vw" + IMPORTANT,
        minWidth: "75vw" + IMPORTANT
      },
      authFooter: {
        minHeight: "10vh",
        ...this.defaultUtilityStyles.px2,
        ...this.defaultUtilityStyles.displayFlex,
        ...this.defaultUtilityStyles.flexDirectionRow,
        ...this.defaultUtilityStyles.justifyContentSpaceBetween,
        ...this.defaultUtilityStyles.alignItemsEnd,
      }
    };
  }
}
