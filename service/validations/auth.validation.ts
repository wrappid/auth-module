import * as yup from "yup";

const identifier = yup
  .string()
  .matches(/^([0-9]{10}|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+)$/);


const checkLoginSchema = {
  body: yup
    .object({
      identifier: identifier.required("identifier required"),
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};


const registerSchema = {
  body: yup
    .object({
      // Email or phone validation
      identifier:identifier.required("identifier required"),
      // Password validation
      password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

      // Confirm password validation
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),

      // OTP validation
      otp: yup
        .string()
        .required("OTP is required")
        .matches(/^[0-9]+$/, "OTP must only contain numbers")
        .length(6, "OTP must be exactly 6 digits")
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};

const loginwithPasswordSchema = {
  body: yup
    .object({
      identifier: identifier.required("identifier required"),
      password:  yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};

const loginWithOtpSchema = {
  body: yup
    .object({
      // Email or phone validation
      identifier: identifier.required("identifier required"),
      // Otp validation
      otp: yup
        .string()
        .required("OTP is required")
        .matches(/^[0-9]+$/, "OTP must only contain numbers")
        .length(6, "OTP must be exactly 6 digits")
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};

const refreshTokenSchema = {
  body: yup.object({
    refreshToken: yup.string().required("refreshtoken missing")
  }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};

export {
  checkLoginSchema,
  registerSchema,
  loginwithPasswordSchema,
  loginWithOtpSchema,
  refreshTokenSchema
};
