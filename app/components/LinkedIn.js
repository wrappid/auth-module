import { CoreBox, CoreLayoutItem } from "@wrappid/core";

import AuthLayout from "./layout/AuthLayout";

const LinkedIn = () => {

  return (
    <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
      <CoreBox>Welcome to login page</CoreBox>
    </CoreLayoutItem>
  );
};

export default LinkedIn;