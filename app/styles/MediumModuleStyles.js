import {
  IMPORTANT,
  BaseStyle,
  MediumUtilityStyles
  // eslint-disable-next-line import/no-unresolved
} from "@wrappid/styles";

export default class MediumModuleStyles extends BaseStyle {
  mediumUtilityStyles = new MediumUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      
      authBanner: {
        backgroundImage   : "url(./images/welcome-bg.png)" + IMPORTANT,
        backgroundPosition: "center" + IMPORTANT,
        backgroundRepeat  : "no-repeat" + IMPORTANT,
        backgroundSize    : "cover" + IMPORTANT,
        height            : "100%" + IMPORTANT,
      },
      
      authCardMaxWidth: { maxWidth: "25%" + IMPORTANT },
      
      authCardMinWidth: { minWidth: "25%" + IMPORTANT },
      
      authContainer: { height: "100%" + IMPORTANT },
      
      authForm: { height: "100%" + IMPORTANT },
      
      authFormContainer: { width: "60%" + IMPORTANT },
      
      authWrapper: { width: "45vw" + IMPORTANT },

      /**************************************************
       * Using defaultUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.mediumUtilityStyles.devBorder },
    };
  }
}
