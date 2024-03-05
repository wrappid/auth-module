import { useContext } from "react";

import {
  CoreClasses,
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem,
  CoreRouteRegistryContext
} from "@wrappid/core";
import { useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";

export default function CheckUserExist() {
  const auth = useSelector(state => state.auth);
  const routeRegistry = useContext(CoreRouteRegistryContext);

  const { checkLoginOrRegisterSuccess, authNextPage } = auth;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {checkLoginOrRegisterSuccess && authNextPage !== routeRegistry?.checkuserexists ? (
          <CoreDomNavigate to={"/" + authNextPage} />
        ) : (
          <CoreForm
            styleClasses={[CoreClasses.LAYOUT.AUTH_FORM_CONTAINER]}
            formId="checkUserExist"
            mode="edit" // commented since default mode : edit
            authenticated={false}
          />
        )}
      </CoreLayoutItem>
    </>
  );
}
