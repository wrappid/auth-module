import {
  SmallUtilityStyles,
  BaseStyle
  // eslint-disable-next-line import/no-unresolved
} from "@wrappid/styles";

export default class SmallModuleStyles extends BaseStyle {
  smallUtilityStyles = new SmallUtilityStyles().style;
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
      
      authContainer: { ...this.largeUtilityStyles.h100 },
      
      authForm: { ...this.largeUtilityStyles.h100 },
      
      authFormContainer    : { ...this.largeUtilityStyles.w100 },
      /**************************************************
       * Using smallUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.smallUtilityStyles.devBorder },
    };
  }
}
