// eslint-disable-next-line import/no-unresolved
import { MediumCoreStyles } from "@wrappid/core";

export default class MediumModuleStyles extends MediumCoreStyles {
  constructor() {
    super();
    this.style = {
      
      authCardMaxWidth: { maxWidth: "50%" },
      
      authCardMinWidth: { minWidth: "50%" },
      
      authContainer: { ...this.mediumUtilityStyles.h100 },
      
      authForm: { ...this.mediumUtilityStyles.h100 },
      
      authFormContainer: { width: "60%" },
      
      authWrapper: { width: "45vw" },

      /**************************************************
       * Using defaultUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.mediumUtilityStyles.devBorder },
    };
  }
}
