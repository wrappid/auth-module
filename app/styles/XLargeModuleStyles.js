// eslint-disable-next-line import/no-unresolved
import { XLargeCoreStyles } from "@wrappid/core";
export default class XLargeModuleStyles extends XLargeCoreStyles {
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
