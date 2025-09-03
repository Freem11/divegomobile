
import { DiveSiteConditions } from "../../../entities/diveSiteCondidtions";
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  DiveDate?:    string
  Description?: string
  Conditions: DiveSiteConditions[]
  Photos: string[]
}

export const FormRules: FormValidationRules<Form> =   {
  DiveDate: {
    required: "Date name is required",
  },
  // Description: {
  //   required: "Description is required",
  // },
  Conditions: {
    required: "No Condditions?",
  },
  // Photos: {
  //   required: "No Photos?",
  // },
};
