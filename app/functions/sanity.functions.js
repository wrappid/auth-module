export const SanAddEmailOrPhone = (formData, apiMeta, state) => {
  formData["identifier"] = state?.auth?.navData?.identifier;
  // eslint-disable-next-line no-console
  console.log("--SANITIZATION", formData);
  return { values: formData };
};

export const SanAddEmailOrPhoneRemoveConfirmPassword = (
  formData,
  apiMeta,
  state
) => {
  formData["identifier"] = state?.auth?.navData?.identifier;
  delete formData.confirmPassword;
  // eslint-disable-next-line no-console
  console.log("--SANITIZATION", formData);
  return { values: formData };
};
