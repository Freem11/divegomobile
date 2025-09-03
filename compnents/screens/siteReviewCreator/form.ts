
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  DiveDate?:    string
  Description?: string
}

export const FormRules: FormValidationRules<Form> =   {
  DiveDate: {
    required: "Date name is required",
  },
  Description: {
    required: "Description is required",
  },
};
