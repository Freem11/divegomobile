
import { FormValidationRules } from "../../../forms/form";

export interface Form {
  OrgName?:   string
  URL?:       string
  Latitude?:  number
  Longitude?: number
}


export const FormRules: FormValidationRules<Form> = {
  OrgName: {
    required: "Business name cannot be empty",
  },
  URL: {
    required: "Web Page URL cannot be empty",
  },
  Longitude: {
    required: "Longitude is required",
    min:      {
      value:   -180,
      message: "Longitude must be greater than -180",
    },
    max:      {
      value:   180,
      message: "Longitude must be less than 180",
    } },
  Latitude: {
    required: "Longitude is required",
    min:      {
      value:   -180,
      message: "Latitude must be greater than -180",
    },
    max:      {
      value:   180,
      message: "Latitude must be less than 180",
    } },
};
