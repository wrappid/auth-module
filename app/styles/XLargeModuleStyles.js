// eslint-disable-next-line import/no-unresolved
import { XLargeCoreStyles } from "@wrappid/core";
export default class XLargeModuleStyles extends XLargeCoreStyles {
  constructor() {
    super();
    this.style = {
      authContent   : {},
      authContentBox: {},
      authFooter    : {}
    };
  }
}
