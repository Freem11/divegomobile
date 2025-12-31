
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  Email?: string
  Password?: string
}

export const FormRules: FormValidationRules<Form> = {
  Email: {
    required: "Login and password is required",
  },
  Password: {
    required: "Login and password is required",
  }
};
