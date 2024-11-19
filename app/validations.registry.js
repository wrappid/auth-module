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

// Helper function to validate email
const isValidEmail = (email) => {
  // Basic email structure check
  if (email.split("@").length !== 2) return false;

  const [localPart, domainPart] = email.split("@");
      
  // Local part checks
  if (!localPart || localPart.startsWith("-") || localPart.endsWith("-") || 
          localPart.length > 64) return false;

  // Domain part checks
  if (!domainPart || !domainPart.includes(".") || 
          domainPart.startsWith("-") || domainPart.endsWith("-") || 
          domainPart.length > 255) return false;

  // Check for consecutive dots
  if (/\.{2,}/.test(email)) return false;

  // Final regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
};

// Helper function to validate Indian phone number
const isValidPhone = (phone) => {
  const cleanPhone = phone.toString().replace(/[\s-]/g, "");
      
  let numberToValidate = cleanPhone;

  if (cleanPhone.startsWith("+91") && cleanPhone.length === 13) {
    numberToValidate = cleanPhone.slice(3);
  } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
    numberToValidate = cleanPhone.slice(2);
  }

  return /^[6-9]\d{9}$/.test(numberToValidate);
};

const identifier = yup
  .string()
  .required("Email or phone number is required")
  .test("email-or-phone", "Invalid email or phone number format", function(value) {
    if (!value) return false;
  
    // Clean the input value
    const cleanValue = value.trim();
  
    // Determine if it's an email (contains @) or phone number
    if (cleanValue.includes("@")) {
      return isValidEmail(cleanValue);
    } else {
      return isValidPhone(cleanValue);
    }
  })
  .test("detailed-validation", "Invalid format", function(value) {
    if (!value) return false;
  
    const cleanValue = value.trim();
  
    // If input contains @, treat as email
    if (cleanValue.includes("@")) {
      const [localPart, domainPart] = cleanValue.split("@");
  
      if (!localPart || !domainPart) {
        return this.createError({ message: "Invalid email format" });
      }
  
      if (localPart.startsWith("-") || localPart.endsWith("-")) {
        return this.createError({ message: "Email local part cannot start or end with a hyphen" });
      }
  
      if (localPart.length > 64) {
        return this.createError({ message: "Email local part cannot exceed 64 characters" });
      }
  
      if (!domainPart.includes(".")) {
        return this.createError({ message: "Email domain must contain at least one dot" });
      }
  
      if (/\.{2,}/.test(cleanValue)) {
        return this.createError({ message: "Email cannot contain consecutive dots" });
      }
  
    } else {
      // Treat as phone number
      const cleanPhone = cleanValue.replace(/[\s-]/g, "");
          
      let numberToValidate = cleanPhone;

      if (cleanPhone.startsWith("+91")) {
        numberToValidate = cleanPhone.slice(3);
      } else if (cleanPhone.startsWith("91")) {
        numberToValidate = cleanPhone.slice(2);
      }
  
      if (!/^\d+$/.test(numberToValidate)) {
        return this.createError({ message: "Phone number can only contain digits" });
      }
  
      if (numberToValidate.length !== 10) {
        return this.createError({ message: "Phone number must be exactly 10 digits" });
      }
  
      if (!/^[6-9]/.test(numberToValidate)) {
        return this.createError({ message: "Phone number must start with 6, 7, 8, or 9" });
      }
    }
  
    return true;
  });

export const ValidationsRegistry = {
  checkEmailorPhone: { identifier: identifier.required("Either email or phone number is necessary") },

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
