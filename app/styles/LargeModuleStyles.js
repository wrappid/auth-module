// eslint-disable-next-line import/no-unresolved
import { LargeCoreStyles } from "@wrappid/core";

export default class LargeModuleStyles extends LargeCoreStyles {
  constructor() {
    super();
    this.style = {
      authContent   : {},
      authContentBox: {},
      authFooter    : {}
    };
  }
}
