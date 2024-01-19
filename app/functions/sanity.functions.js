export const SanAddEmailOrPhone = (formData, apiMeta, state) => {
  formData["emailOrPhone"] = state?.auth?.navData?.emailOrPhone;
  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.log("--SANITIZATION", formData);
  return { values: formData };
};
