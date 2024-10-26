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
  CoreGrid,
  CoreTypographyBody1
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

              {isEnable && (<CoreBox>

                <CoreBox styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PT2, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                  <CoreTypographyBody1>
                  - OR -
                  </CoreTypographyBody1>
                </CoreBox>

                <CoreBox styleClasses={[CoreClasses.COLOR.TEXT_PRIMARY, CoreClasses.PADDING.PT3, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                  <CoreTypographyBody1>
                  Sign in with your social account to continue.
                  </CoreTypographyBody1>
                </CoreBox>

                <CoreBox>
                  <CoreGrid spacing={2} direction="row" styleClasses={[CoreClasses.PADDING.PT3, CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                    {isFacebookEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                      <FacebookAuthComponent />
                    </CoreBox>}

                    {isLinkedInEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                      <LinkedInAuthComponent />
                    </CoreBox>}

                    {isGithubEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>
                      <GithubAuthComponent />
                    </CoreBox>}

                    {isGoogleEnable && <CoreBox gridProps={{ gridSize: { lg: "auto", md: "auto", sm: "auto" } }}>

                      <CoreBox styleClasses={[CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                        <GoogleAuthComponent />
                      </CoreBox>
                    </CoreBox>}
                  </CoreGrid>
                </CoreBox>
              </CoreBox>)}

            </>
          )}
      </CoreLayoutItem>
    </>
  );
}
