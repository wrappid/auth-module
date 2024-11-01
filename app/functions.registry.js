export const FunctionsRegistry = {
  SanAddEmailOrPhone: (formData, apiMeta, state) => {
    formData["identifier"] = state?.auth?.navData?.identifier;
    return { values: formData };
  },

  SanAddEmailOrPhoneRemoveConfirmPassword: (formData, apiMeta, state) => {
    let newData = { ...formData };

    newData["identifier"] = state?.auth?.navData?.identifier;
    newData.confirmPassword;
    return { values: newData };
  },
};
