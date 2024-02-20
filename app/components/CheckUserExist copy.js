import { useContext } from "react";

import {
  CoreForm,
  CoreClasses,
  CoreDomNavigate,
  CoreRouteRegistryContext
} from "@wrappid/core";
import { useSelector } from "react-redux";

import { AuthContainer } from "./AuthContainer";

const CheckUserExist = () => {
  const auth = useSelector(state => state.auth);
  const routeRegistry = useContext(CoreRouteRegistryContext);

  const { checkLoginOrRegisterSuccess, authNextPage } = auth;

  if (checkLoginOrRegisterSuccess && authNextPage !== routeRegistry?.checkuserexists) {
    return <CoreDomNavigate to={"/" + authNextPage} />;
  }
  else
    return (
      <AuthContainer>
        <CoreForm
          styleClasses={[CoreClasses.LAYOUT.AUTH_FORM_CONTAINER]}
          formId="checkUserExist"
          mode="edit" // commented since default mode : edit
          authenticated={false}
        />
      </AuthContainer>
    );
};

export default CheckUserExist;
