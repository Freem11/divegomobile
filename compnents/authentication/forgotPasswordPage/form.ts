
import { FormValidationRules } from "../../../forms/form";
import { validationEmail } from "../../../forms/validation";

export interface Form {
  Email?:      string
}

export const FormRules: FormValidationRules<Form> = {
  Email: {
    required: "Email is required",
    ...validationEmail
  },
};
