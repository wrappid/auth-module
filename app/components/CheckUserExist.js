import React from "react";

import {
  CoreDomNavigate,
  CoreForm,
  CoreLayoutItem,
  FacebookAuthComponent,
  LinkedInAuthComponent,
  GithubAuthComponent,
  CoreBox,
  GoogleAuthComponent,
  CoreClasses,
  CoreGrid
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
            <CoreDomNavigate to={`/${authNextPage}`} />
          ) : (
            <>
              <CoreForm
                formId="checkUserExist"
                mode="edit"
                authenticated={false}
              />
              
              <CoreBox styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PT2, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                - OR -
              </CoreBox>

              <CoreBox styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PT3, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                Sign in with your social account to continue.
              </CoreBox>

              <CoreBox>
                <CoreGrid spacing={2} direction="row" styleClasses={[CoreClasses.PADDING.PT3, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                  {isEnable && isFacebookEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                    <FacebookAuthComponent />
                  </CoreBox>}

                  {isEnable && isLinkedInEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                    <LinkedInAuthComponent />
                  </CoreBox>}

                  {isEnable && isGithubEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                    <GithubAuthComponent />
                  </CoreBox>}

                  {isEnable && isGoogleEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                    
                    <CoreBox styleClasses={[CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                      <GoogleAuthComponent />
                    </CoreBox>
                  </CoreBox>}
                </CoreGrid>
              </CoreBox>

            </>
          )}
      </CoreLayoutItem>
    </>
  );
}
