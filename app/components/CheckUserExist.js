import React from "react";

import {
  CoreBox,
  CoreClasses,
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem,
  CoreStack,
  FacebookAuthComponent,
  GithubAuthComponent,
  GoogleAuthComponent,
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
  const isGithubEnable = config?.wrappid?.socialLogin?.github?.enable;
  const isGoogleEnable = config?.wrappid?.socialLogin?.google?.enable;

  return (
    <>
      <CoreLayoutItem id={AuthLayout.PLACEHOLDER.CONTENT}>
        {checkLoginOrRegisterSuccess &&
          authNextPage.toLowerCase() !== ModuleRoute.LOGIN_ROUTE ? (
            <CoreDomNavigate to={`${authNextPage}`} />
          ) : (
            <>
              <CoreStack spacing={5}>
                <CoreForm
                  formId="checkUserExist"
                  mode="edit"
                  authenticated={false}
                />

                {isEnable && (

                  <CoreBox styleClasses={[CoreClasses.GAP.GAP_2, CoreClasses.DISPLAY.FLEX, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER, CoreClasses.GAP.SM.GAP_1]}>
                    {isFacebookEnable &&
                    <FacebookAuthComponent />}

                    {isLinkedInEnable &&
                    <LinkedInAuthComponent />}

                    {isGithubEnable &&
                    <GithubAuthComponent />}

                    {isGoogleEnable &&
                      <GoogleAuthComponent />}
                  </CoreBox>)}
              </CoreStack>
            </>
          )}
      </CoreLayoutItem>
    </>
  );
}
