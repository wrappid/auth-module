import { CoreForm } from "@wrappid/core";

let resetPasswordFormSchema = {
  "actions"      : [],
  "allowCancel"  : false,
  "cardElevation": false,
  "create"       : {
    "authRequired"  : false,
    "endpoint"      : "/loginWithOtp?reset=true",
    "errorType"     : "LOGIN_ERROR",
    "method"        : "post",
    "onSubmitRefine": "SanAddEmailOrPhoneRemoveConfirmPassword",
    "successType"   : "LOGIN_SUCCESS"
  },
  "fields": [
    {
      "gridSize": 12,
      "id"      : "otp",
      "label"   : "Enter OTP",
      "name"    : "otp",
      "required": true,
      "type"    : "otp"
    },
    {
      "gridSize": 12,
      "id"      : "password",
      "label"   : "Enter password",
      "name"    : "password",
      "required": true,
      "type"    : "newPassword"
    },
    {
      "gridSize": 12,
      "id"      : "confirmPassword",
      "label"   : "Confirm Password",
      "name"    : "confirmPassword",
      "required": true,
      "type"    : "confirmPassword"
    }
  ],
  "headerAction"     : false,
  "submitButtonLabel": "Login"
};

export default function resetPasswordForm(props) {
  return (
    <>
      <CoreForm
        formId="resetPasswordForm"
        formJson={{ resetPasswordForm: resetPasswordFormSchema }}
        {...props}
      />
    </>
  );
}