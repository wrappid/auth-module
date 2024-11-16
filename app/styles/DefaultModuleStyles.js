// eslint-disable-next-line import/no-unresolved
import { DefaultCoreStyles } from "@wrappid/core";
import { DefaultUtilityStyles, IMPORTANT } from "@wrappid/styles";

export default class DefaultModuleStyles extends DefaultCoreStyles {
  defaultUtilityStyles = new DefaultUtilityStyles().style;

  constructor() {
    super();
    this.style = {
      authContent: {
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
        ...this.defaultUtilityStyles.justifyContentSpaceBetween,
        ...this.defaultUtilityStyles.alignItemsEnd,
        ...this.defaultUtilityStyles.flexDirectionRow,
      }
    };
  }
}
