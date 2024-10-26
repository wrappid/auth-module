import { 
// eslint-disable-next-line etc/no-commented-out-code
  // clearValidatePhoneEmail,
  getFormikRequiredMessage
} from "@wrappid/core";
import * as yup from "yup";
/**
 * @todo
 * commented validation temporarily 
 */
export const ValidationsRegistry = {
  checkEmailorPhone: {
    emailOrPhone: yup
      .string()
    // eslint-disable-next-line etc/no-commented-out-code
      // .test(
      //   "email-phone-validation",
      //   "Not a valid email or phone no.",
      //   clearValidatePhoneEmail
      // )
      .required("Please enter email or phone")
  },

  confirmPassword: {
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required(getFormikRequiredMessage("confirmPassword")),
    newPassword: yup
      .string()
      .required(getFormikRequiredMessage("newPassword"))
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])(?=.{8,})/,
        "At least 8 Characters, a mixture of uppercase, lowercase, numbers and special  characters"
      ),
    password: yup
      .string()
      .required("Enter old password"),
  },

  enterPassword: { password: yup.string().required("Enter password") }
};
