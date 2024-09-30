
import {
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem,
  LinkedInAuthComponent
} from "@wrappid/core";
import { useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

export default function CheckUserExist() {
  const auth = useSelector(state => state.auth);
  const { checkLoginOrRegisterSuccess, authNextPage } = auth;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {checkLoginOrRegisterSuccess && authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE ? (
          <CoreDomNavigate to={`/${authNextPage}`} />
        ) : (
          <>
            <CoreForm
              formId="checkUserExist"
              mode="edit"
              authenticated={false}
            />

            <LinkedInAuthComponent />
          </>
        )}
      </CoreLayoutItem>
    </>
  );
}
