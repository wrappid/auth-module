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
  CoreClasses
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

              <CoreBox
                styleClasses={[CoreClasses.PADDING.PT5, CoreClasses.PADDING.PB3, CoreClasses.DISPLAY.FLEX]}
              >
                {isEnable && isFacebookEnable && <FacebookAuthComponent />}

                {isEnable && isLinkedInEnable && <LinkedInAuthComponent />}

                {isEnable && isGithubEnable && <GithubAuthComponent />}

              </CoreBox>

              {isEnable && isGoogleEnable &&
              <CoreBox styleClasses={[CoreClasses.ALIGNMENT.JUSTIFY_CONTENT_CENTER]}>
                <GoogleAuthComponent />
              </CoreBox>}
            </>
          )}
      </CoreLayoutItem>
    </>
  );
}
