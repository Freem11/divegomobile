
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  NewPass?: string
}

export const FormRules: FormValidationRules<Form> = {
  NewPass: {
    required: "A new assword is required"
  },
};
