export const SanAddEmailOrPhone = (formData, apiMeta, state) => {
  formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
  console.log("--SANITIZATION", formData);
  return { values: formData };
};

export const SanAddEmailOrPhoneRemoveConfirmPassword = (
  formData,
  apiMeta,
  state
) => {
  formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
  delete formData.confirmPassword;
  console.log("--SANITIZATION", formData);
  return { values: formData };
};
