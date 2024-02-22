// eslint-disable-next-line import/no-unresolved
import { DefaultUtilityStyles, IMPORTANT, BaseStyle } from "@wrappid/styles";

export default class DefaultModuleStyles extends BaseStyle {
  defaultUtilityStyles = new DefaultUtilityStyles().style;
  constructor() {
    super();
    this.style = {

      authAppLogo: {
        height: 50,
        width : 190
      },

      authCard: {
        background: "transparent" + IMPORTANT,
        boxShadow : "none" + IMPORTANT
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
