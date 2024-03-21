
import {
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem
} from "@wrappid/core";
import { useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";

export default function CheckUserExist() {
  const auth = useSelector(state => state.auth);
  const { checkLoginOrRegisterSuccess, authNextPage } = auth;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {checkLoginOrRegisterSuccess && authNextPage !== "checkuserexists" ? (
          <CoreDomNavigate to={`/${authNextPage}`} />
        ) : (
          <CoreForm
            formId="checkUserExist"
            mode="edit"
            authenticated={false}
          />
        )}
      </CoreLayoutItem>
    </>
  );
}
