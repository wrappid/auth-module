// asyncSelect and formSubmitSanitization

export const FunctionRegistry = {
  SanAddEmailOrPhone: (formData, apiMeta, state) => {
    formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    return { values: formData };
  },

  SanAddEmailOrPhoneRemoveConfirmPassword: (formData, apiMeta, state) => {
    formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    delete formData.confirmPassword;
    return { values: formData };
  },
};
