// asyncSelect and formSubmitSanitization

export const FunctionsRegistry = {
  SanAddEmailOrPhone: (formData, apiMeta, state) => {
    formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    console.log("--SANITIZATION", formData);
    return { values: formData };
  },

  SanAddEmailOrPhoneRemoveConfirmPassword: (formData, apiMeta, state) => {
    formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    delete formData.confirmPassword;
    console.log("--SANITIZATION", formData);
    return { values: formData };
  },
};
