
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  Email?:      string
  Password?:  string
}

export const FormRules: FormValidationRules<Form> = {
  Email: {
    required: "Lgoin and password is required",
  },
  Password: {
    required: "Lgoin and password is required",
  }
};
