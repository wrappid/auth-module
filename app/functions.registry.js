export const FunctionsRegistry = {
  SanAddEmailOrPhone: (formData, apiMeta, state) => {
    formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    return { values: formData };
  },

  SanAddEmailOrPhoneRemoveConfirmPassword: (formData, apiMeta, state) => {
    let newData = {...formData}
    newData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
    delete newData.confirmPassword;
    return { values: newData };
  },
};
