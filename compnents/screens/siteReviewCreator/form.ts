
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  DiveTitle: string
  DiveDate?:    string
  Description?: string
}

export const FormRules: FormValidationRules<Form> =   {
  DiveTitle: {
    required: "Title name is required",
  },
  DiveDate: {
    required: "Date name is required",
  },
  Description: {
    required: "Description is required",
  },
};
