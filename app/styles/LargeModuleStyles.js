// eslint-disable-next-line import/no-unresolved
import { BaseStyle, LargeUtilityStyles } from "@wrappid/styles";

export default class LargeModuleStyles extends BaseStyle {
  largeUtilityStyles = new LargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {

      authContainer: { height: "100%" },

      authForm: { ...this.largeUtilityStyles.h100 },

      authFormContainer: { width: "60%" },

      authWrapper          : { width: "45vw" },
      /**************************************************
       * Using LargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.largeUtilityStyles.devBorder },
    };
  }
}
