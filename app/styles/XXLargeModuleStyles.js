
// --import { XX_LARGE_WINDOW_WIDTH } from "../config/constants";

// eslint-disable-next-line import/no-unresolved
import { BaseStyle, XXLargeUtilityStyles } from "@wrappid/styles";

export default class XXLargeModuleStyles extends BaseStyle {
  xxLargeUtilityStyles = new XXLargeUtilityStyles().style;
  constructor() {
    super();
    this.style = {
      /**************************************************
       * Using XXLargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.xxLargeUtilityStyles.devBorder },
    };
  }
}
