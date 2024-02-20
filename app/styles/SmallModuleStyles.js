import {
  IMPORTANT,
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
      authBanner: {
        backgroundImage   : "url(./images/welcome-bg.png)" + IMPORTANT,
        backgroundPosition: "center" + IMPORTANT,
        backgroundRepeat  : "no-repeat" + IMPORTANT,
        backgroundSize    : "cover" + IMPORTANT,
        height            : "100%" + IMPORTANT,
      },
      
      authContainer: { height: "100%" + IMPORTANT },
      
      authForm: { height: "100%" + IMPORTANT },
      
      authFormContainer    : { width: "100%" + IMPORTANT },
      /**************************************************
       * Using smallUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.smallUtilityStyles.devBorder },
    };
  }
}
