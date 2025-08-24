
import { FormValidationRules } from "../../../forms/form";
import { validationEmail, validationPassword } from "../../../forms/validation";

export interface Form {
  Name?:      string
  Email?:      string
  Password?:  string
}

export const FormRules: FormValidationRules<Form> = {
  Name: {
    required: "Name is required",
  },
  Email: {
    required: "Email is required",
    ...validationEmail
  },
  Password: {
    required: "Password is required",
    ...validationPassword,
  }
};
