// eslint-disable-next-line import/no-unresolved
import { XLargeCoreStyles } from "@wrappid/core";
import { XLargeUtilityStyles } from "@wrappid/styles";

export default class XLargeModuleStyles extends XLargeCoreStyles {
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
