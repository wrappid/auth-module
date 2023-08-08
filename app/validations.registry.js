import { clearValidatePhoneEmail } from "@wrappid/core";
import * as yup from "yup";

export const ValidationRegistry = {
  checkEmailorPhone: {
    emailOrPhone: yup
      .string()
      .test(
        "email-phone-validation",
        "Not a valid email or phone no.",
        clearValidatePhoneEmail
      )
      .required("Please enter email or phone")
  },

  confirmPassword: {
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
    newPassword: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])(?=.{8,})/,
        "At least 8 Characters, a mixture of uppercase, lowercase, numbers and special  characters"
      ),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])(?=.{8,})/,
        "At least 8 Characters, a mixture of uppercase, lowercase, numbers and special  characters"
      ),
  },

  enterPassword: { password: yup.string().required("Enter password") }
};