import { useContext } from "react";

import {
  CoreForm,
  CoreClasses,
  CoreDomNavigate,
  CoreRouteRegistryContext,
  CoreLayoutItem
} from "@wrappid/core";
import { useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";

export default function CheckUserExist() {
  const auth = useSelector(state => state.auth);
  const routeRegistry = useContext(CoreRouteRegistryContext);

  const { checkLoginOrRegisterSuccess, authNextPage } = auth;

  if (checkLoginOrRegisterSuccess && authNextPage !== routeRegistry?.checkuserexists) {
    return <CoreDomNavigate to={"/" + authNextPage} />;
  }
  else
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
