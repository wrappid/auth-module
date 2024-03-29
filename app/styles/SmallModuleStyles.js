// eslint-disable-next-line import/no-unresolved
import { SmallCoreStyles } from "@wrappid/core";

export default class SmallModuleStyles extends SmallCoreStyles {
  constructor() {
    super();
    this.style = {
      
      authAppLogo: { width: 190 },
      
      /**
       * @todo review required 
        authAppLogo: {
          height: "auto",
          width : 190
        }, 
      */
      
      authContainer: { ...this.smallUtilityStyles.h100 },
      
      authForm: { ...this.smallUtilityStyles.h100 },
      
      authFormContainer    : { ...this.smallUtilityStyles.w100 },
      /**************************************************
       * Using smallUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.smallUtilityStyles.devBorder },
    };
  }
}
