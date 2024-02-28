// eslint-disable-next-line import/no-unresolved
import { BaseStyle, XLargeUtilityStyles } from "@wrappid/styles";

export default class XLargeModuleStyles extends BaseStyle {
  xLargeUtilityStyles = new XLargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      
      authContainer: { ...this.largeUtilityStyles.h100 },
      
      authForm: { ...this.largeUtilityStyles.h100 },
      
      authFormContainer    : { width: "60%" },
      /**************************************************
       * Using XLargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.xLargeUtilityStyles.devBorder },
    };
  }
}
