import { Component } from "react";

import {
  CoreForm,
  CoreClasses,
  CoreDomNavigate
} from "@wrappid/core";
import { connect } from "react-redux";

import { AuthContainer } from "./AuthContainer";

class CheckUserExist extends Component {
  state = {};

  componentDidMount = () => {};
  componentDidUpdate = () => {};
  render() {
    const { checkLoginOrRegisterSuccess, authNextPage } = this.props;

    if (checkLoginOrRegisterSuccess && authNextPage !== "checkUserExist") {
      return <CoreDomNavigate to={"/" + authNextPage} />;
    }

    return (
      <AuthContainer>
        <CoreForm
          styleClasses={[CoreClasses.LAYOUT.AUTH_FORM_CONTAINER]}
          // initData={{ emailOrPhone: email }}
          formId="checkUserExist"
          mode="edit" // commented since default mode : edit
          authenticated={false}
        />
      </AuthContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth                       : state.auth,
    authNextPage               : state.auth.authNextPage,
    checkLoginOrRegisterSuccess: state.auth.checkLoginOrRegisterSuccess,

    requestUrl: state?.manageAssistant?.requestUrl,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckUserExist);
