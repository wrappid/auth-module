import React from "react";

import {
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem,
  FacebookAuthComponent,
  LinkedInAuthComponent
} from "@wrappid/core";
import { WrappidDataContext } from "@wrappid/styles";
import { useSelector } from "react-redux";

import AuthLayout from "./layout/AuthLayout";
import { ModuleRoute } from "../constants/app.constants";

export default function CheckUserExist() {
  const auth = useSelector((state) => state.auth);
  const { checkLoginOrRegisterSuccess, authNextPage } = auth;
  const { config } = React.useContext(WrappidDataContext);
  const isEnable = config?.wrappid?.socialLogin?.enable;
  const isLinkedInEnable = config?.wrappid?.socialLogin?.linkedin?.enable;
  const isFacebookEnable = config?.wrappid?.socialLogin?.facebook?.enable;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {checkLoginOrRegisterSuccess &&
        authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE ? (
            <CoreDomNavigate to={`/${authNextPage}`} />
          ) : (
            <>
              <CoreForm
                formId="checkUserExist"
                mode="edit"
                authenticated={false}
              />

              {isEnable && isFacebookEnable && <FacebookAuthComponent />} 

              {isEnable && isLinkedInEnable && <LinkedInAuthComponent />}
            </>
          )}
      </CoreLayoutItem>
    </>
  );
}
