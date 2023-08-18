const yup = require("yup");
const emailOrPhone = yup
  .string()
  .matches(/^([0-9]{10}|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+)$/);


const checkLoginOrRegister = {
  body: yup
    .object({
      emailOrPhone: emailOrPhone.required(),
    })
    .noUnknown()
    .strict(),
  query: yup
    .object({
      loginWithOtp: yup.string(),
    })
    .noUnknown()
    .strict(),
};

module.exports = {
  checkLoginOrRegister
};
