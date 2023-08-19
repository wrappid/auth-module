const yup = require("yup");
const emailOrPhone = yup
  .string()
  .matches(/^([0-9]{10}|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+)$/);

  const otp = yup.string().min(000000).max(999999);

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

const login = {
  body: yup
    .object({
      emailOrPhone: emailOrPhone.required(),
      password: yup.string().required(),
      devInfo: yup.string(),
    })
    .noUnknown()
    .strict(),
  query: yup.object({}).noUnknown().strict(),
};

const postLoginWithOtp = {
  body: yup
    .object({
      otp: otp.required(),
      emailOrPhone: emailOrPhone.required(),
      password: yup.string(),
      devInfo: yup.string(),
    })
    .noUnknown()
    .strict(),
  query: yup.object({ reset: yup.string().notRequired() }).noUnknown().strict(),
};


const postLogoutSchema = {
  body: yup.object({}).noUnknown().strict(),
  query: yup.object({}).noUnknown().strict(),
};


const getIpSchema = {
  params: yup.object({}).noUnknown().strict(),
  query: yup.object({}).noUnknown().strict(),
};



const refreshTokenSchema = {
  body: yup
    .object({
      refreshToken: yup.string().required(),
    })
    .noUnknown()
    .strict(),
  query: yup.object({}).noUnknown().strict(),
};


module.exports = {
  checkLoginOrRegister,
  login,
  postLoginWithOtp,
  postLogoutSchema,
  getIpSchema,
  refreshTokenSchema
};
