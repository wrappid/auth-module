// eslint-disable-next-line import/no-unresolved
import { LargeCoreStyles } from "@wrappid/core";

export default class LargeModuleStyles extends LargeCoreStyles {
  constructor() {
    super();
    this.style = {

      authContainer: { ...this.largeUtilityStyles.h100 },

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
