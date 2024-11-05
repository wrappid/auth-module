import * as yup from "yup";

// const identifier = yup
//   .string()
//   .matches(/^([0-9]{10}|[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+)$/, "The email or phone number format is incorrect.");


const identifier = yup
  .string()
  .required("Email or phone number is required")
  .test("email-or-phone", "Invalid email or phone number format", function(value) {
    if (!value) return false;
  
    // Helper function to validate email
    const isValidEmail = (email:string) => {
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
    const isValidPhone = (phone:string) => {
      const cleanPhone = phone.toString().replace(/[\s-]/g, "");
          
      let numberToValidate = cleanPhone;
      if (cleanPhone.startsWith("+91") && cleanPhone.length === 13) {
        numberToValidate = cleanPhone.slice(3);
      } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
        numberToValidate = cleanPhone.slice(2);
      }
  
      return /^[6-9]\d{9}$/.test(numberToValidate);
    };
  
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
        return this.createError({
          message: "Invalid email format"
        });
      }
  
      if (localPart.startsWith("-") || localPart.endsWith("-")) {
        return this.createError({
          message: "Email local part cannot start or end with a hyphen"
        });
      }
  
      if (localPart.length > 64) {
        return this.createError({
          message: "Email local part cannot exceed 64 characters"
        });
      }
  
      if (!domainPart.includes(".")) {
        return this.createError({
          message: "Email domain must contain at least one dot"
        });
      }
  
      if (/\.{2,}/.test(cleanValue)) {
        return this.createError({
          message: "Email cannot contain consecutive dots"
        });
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
        return this.createError({
          message: "Phone number can only contain digits"
        });
      }
  
      if (numberToValidate.length !== 10) {
        return this.createError({
          message: "Phone number must be exactly 10 digits"
        });
      }
  
      if (!/^[6-9]/.test(numberToValidate)) {
        return this.createError({
          message: "Phone number must start with 6, 7, 8, or 9"
        });
      }
    }
  
    return true;
  });

  

const checkLoginSchema = {
  body: yup
    .object({
      identifier: identifier.required("Either email or phone number, is necessary"),
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};


const registerSchema = {
  body: yup
    .object({
      // Email or phone validation
      identifier:identifier.required("Either email or phone number, is necessary"),
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
      identifier: identifier.required("Either email or phone number, is necessary"),
      password: yup
        .string()
        .required("Password is required")
    }).noUnknown().strict(),
  query:  yup.object().noUnknown().strict(),
  params:  yup.object().noUnknown().strict()
};

const loginWithOtpSchema = {
  body: yup
    .object({
      // Email or phone validation
      identifier: identifier.required("Either email or phone number, is necessary"),
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
  checkLoginSchema, loginWithOtpSchema, loginwithPasswordSchema, refreshTokenSchema, registerSchema
};

