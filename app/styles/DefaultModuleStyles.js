// eslint-disable-next-line import/no-unresolved
import { DefaultCoreStyles } from "@wrappid/core";
import { IMPORTANT } from "@wrappid/styles";

export default class DefaultModuleStyles extends DefaultCoreStyles {
  constructor() {
    super();
    this.style = {

      authAppLogo: {
        height: 50,
        width : 190
      },

      authBanner: {
        backgroundImage   : "url(./images/welcome-bg.png)",
        backgroundPosition: "center" + IMPORTANT,
        backgroundRepeat  : "no-repeat" + IMPORTANT,
        backgroundSize    : "cover" + IMPORTANT,
        height            : "100%" + IMPORTANT,
        ...this.defaultUtilityStyles.justifyContentCenter
      },

      authCard: {
        ...this.defaultUtilityStyles.bgTransparent,
        ...this.defaultUtilityStyles.shadowNone
      },

      authWrapper: {
        ...this.defaultUtilityStyles.justifyContentCenter,
        ...this.defaultUtilityStyles.alignContentCenter,
        ...this.defaultUtilityStyles.flexWrapWrap,
        ...this.defaultUtilityStyles.vh100,
        width: "98vw" + IMPORTANT,
      },

      /**************************************************
       * Using defaultUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.defaultUtilityStyles.devBorder },
    };
  }
}
