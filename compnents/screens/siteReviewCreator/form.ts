import { DiveSiteConditions } from "../../../entities/diveSiteCondidtions";
import { FormValidationRules } from "../../../forms/form";
import moment from "moment";

export interface Form {
  DiveDate?:    string
  Description?: string
  Conditions: DiveSiteConditions[]
  Photos:  string[];
}

export const FormRules: FormValidationRules<Form> =   {
  DiveDate: {
    required: "Date is required",
    validate: {
      validDate: (value) => {
        if (!value) return "Date is required";
        const date = moment(value, "YYYY-MM-DD", true);
        if (!date.isValid()) {
          return "Please enter a valid date";
        }
        if (date.isAfter(moment(), 'day')) {
          return "Date cannot be in the future";
        }
        return true;
      }
    }
  },
  Description: {
    required: "Description is required",
  },
  Conditions: {
    required: "No Conditions?",
  },
  Photos: {
    required: "No Photos?",
  },
};
