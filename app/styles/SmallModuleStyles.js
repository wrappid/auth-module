// eslint-disable-next-line import/no-unresolved
import { SmallCoreStyles } from "@wrappid/core";
import { IMPORTANT } from "@wrappid/styles";

export default class SmallModuleStyles extends SmallCoreStyles {
  constructor() {
    super();
    this.style = {
      authContent   : {},
      authContentBox: {
        maxWidth: "35vw" + IMPORTANT,
        minWidth: "35vw" + IMPORTANT
      },
      authFooter: {}
    };
  }
}
