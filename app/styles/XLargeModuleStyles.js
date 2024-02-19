// eslint-disable-next-line import/no-unresolved
import { BaseStyle, IMPORTANT, XLargeUtilityStyles } from "@wrappid/styles";

export default class XLargeModuleStyles extends BaseStyle {
  xLargeUtilityStyles = new XLargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      /**************************************************
       * Using XLargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.xLargeUtilityStyles.devBorder },
      authBanner: {
        backgroundImage: "url(./images/welcome-bg.png)" + IMPORTANT,
        backgroundPosition: "center" + IMPORTANT,
        backgroundRepeat: "no-repeat" + IMPORTANT,
        backgroundSize: "cover" + IMPORTANT,
        height: "100%" + IMPORTANT,
      },
      authContainer: { height: "100%" + IMPORTANT },
      authForm: { height: "100%" + IMPORTANT },
      authFormContainer: { width: "60%" + IMPORTANT },
    };
  }
}
