// eslint-disable-next-line import/no-unresolved
import { BaseStyle, IMPORTANT, LargeUtilityStyles } from "@wrappid/styles";

export default class LargeModuleStyles extends BaseStyle {
  largeUtilityStyles = new LargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      
      authBanner: {
        backgroundImage   : "url(./images/welcome-bg.png)",
        backgroundPosition: "center" + IMPORTANT,
        backgroundRepeat  : "no-repeat" + IMPORTANT,
        backgroundSize    : "cover" + IMPORTANT,
        height            : "100%" + IMPORTANT,
      },
      
      authContainer: { height: "100%" + IMPORTANT },
      
      authForm: { height: "100%" + IMPORTANT },
      
      authFormContainer: { width: "60%" + IMPORTANT },
      
      authWrapper          : { width: "45vw" + IMPORTANT },
      /**************************************************
       * Using LargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.largeUtilityStyles.devBorder },
    };
  }
}
