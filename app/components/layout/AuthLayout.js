// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React from "react";

import { CoreLayoutPlaceHolder } from "@wrappid/core";

import AuthCustomFooter from "../AuthCustomFooter";

export default function AuthLayout() {
  return (
    <>
      <CoreLayoutPlaceHolder id="content" />

      <AuthCustomFooter />
    </>
  );
}
