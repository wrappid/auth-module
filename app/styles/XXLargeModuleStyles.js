
// --import { XX_LARGE_WINDOW_WIDTH } from "../config/constants";

// eslint-disable-next-line import/no-unresolved
import { XXLargeCoreStyles } from "@wrappid/core";

export default class XXLargeModuleStyles extends XXLargeCoreStyles {
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
