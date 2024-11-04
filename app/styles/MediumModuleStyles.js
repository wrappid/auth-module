// eslint-disable-next-line import/no-unresolved
import { MediumCoreStyles } from "@wrappid/core";
import { IMPORTANT } from "@wrappid/styles";

export default class MediumModuleStyles extends MediumCoreStyles {
  constructor() {
    super();
    this.style = {
      authContent: {},
      
      authContentBox: {
        maxWidth: "25vw" + IMPORTANT,
        minWidth: "25vw" + IMPORTANT
      },
      
      authFooter: {},
    };
  }
}
