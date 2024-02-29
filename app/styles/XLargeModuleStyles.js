// eslint-disable-next-line import/no-unresolved
import { BaseStyle, XLargeUtilityStyles } from "@wrappid/styles";

export default class XLargeModuleStyles extends BaseStyle {
  xLargeUtilityStyles = new XLargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      
      authContainer: { ...this.xLargeUtilityStyles.h100 },
      
      authForm: { ...this.xLargeUtilityStyles.h100 },
      
      authFormContainer    : { width: "60%" },
      /**************************************************
       * Using XLargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.xLargeUtilityStyles.devBorder },
    };
  }
}
