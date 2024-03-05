// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars
import React from "react";

import { CoreLayoutPlaceholder } from "@wrappid/core";

import AuthCustomFooter from "../AuthCustomFooter";

export default function AuthLayout() {
  return (
    <>
      <CoreLayoutPlaceholder id={AuthLayout.PLACEHOLDER.CONTENT} />

      <AuthCustomFooter />
    </>
  );
}
AuthLayout.PLACEHOLDER = { CONTENT: "content" };
