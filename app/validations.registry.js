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
  if (!phone) return false;

  // Convert to string and clean the input by removing spaces and hyphens
  const cleanPhone = phone.toString().replace(/[\s-]/g, "");
      
  let numberToValidate = cleanPhone;

  // Handle different phone number formats:
  // 1. +91 prefix (international format)
  // 2. 91 prefix (without +)
  // 3. Plain 10-digit number
  // 4. Number with just + prefix
  if (cleanPhone.startsWith("+91") && cleanPhone.length === 13) {
    numberToValidate = cleanPhone.slice(3);
  } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
    numberToValidate = cleanPhone.slice(2);
  } else if (cleanPhone.startsWith("+")) {
    numberToValidate = cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("0") && cleanPhone.length == 11 ) {
    numberToValidate = cleanPhone.slice(1);
  }

  // Validate the final number:
  // - Must start with 6, 7, 8, or 9
  // - Must be exactly 10 digits
  return /^[6-9]\d{9}$/.test(numberToValidate);
};

// Main validation schema for identifier (email or phone)
const identifier = yup
  .string()
  .required("Email or phone number is required")
  // First test: Basic format validation
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
  // Second test: Detailed validation with specific error messages
  .test("detailed-validation", "Invalid format", function(value) {
    if (!value) return false;
  
    const cleanValue = value.trim();
  
    // If input contains @, treat as email
    if (cleanValue.includes("@")) {
      const [localPart, domainPart] = cleanValue.split("@");
  
      // Check email local part
      if (!localPart || !domainPart) {
        return this.createError({ message: "Invalid email format" });
      }
  
      if (localPart.startsWith("-") || localPart.endsWith("-")) {
        return this.createError({ message: "Email local part cannot start or end with a hyphen" });
      }
  
      if (localPart.length > 64) {
        return this.createError({ message: "Email local part cannot exceed 64 characters" });
      }
  
      // Check email domain part
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

      // Process different phone number formats
      if (cleanPhone.startsWith("+91") && cleanPhone.length === 13) {
        numberToValidate = cleanPhone.slice(3);
      } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
        numberToValidate = cleanPhone.slice(2);
      } else if (cleanPhone.startsWith("+")) {
        numberToValidate = cleanPhone.slice(1);
      } else if (cleanPhone.startsWith("0") && cleanPhone.length == 11 ) {
        numberToValidate = cleanPhone.slice(1);
      }
  
      // Validate phone number format
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

// Export validation schemas
export const ValidationsRegistry = {
  // Schema for email/phone validation
  checkEmailorPhone: { identifier: identifier.required("Either email or phone number is necessary") },

  // Schema for password confirmation
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

  // Schema for password entry
  enterPassword: { password: yup.string().required("Enter password") }
};