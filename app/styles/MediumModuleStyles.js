import {
  BaseStyle,
  MediumUtilityStyles
  // eslint-disable-next-line import/no-unresolved
} from "@wrappid/styles";

export default class MediumModuleStyles extends BaseStyle {
  mediumUtilityStyles = new MediumUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      
      authCardMaxWidth: { maxWidth: "50%" },
      
      authCardMinWidth: { minWidth: "50%" },
      
      authContainer: { ...this.largeUtilityStyles.h100 },
      
      authForm: { ...this.largeUtilityStyles.h100 },
      
      authFormContainer: { width: "60%" },
      
      authWrapper: { width: "45vw" },

      /**************************************************
       * Using defaultUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.mediumUtilityStyles.devBorder },
    };
  }
}
