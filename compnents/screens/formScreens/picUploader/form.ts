import moment from "moment";

import { i18n } from "../../../../i18n";
import { FormValidationRules } from "../../../utils/forms";

type dropDownItem = { key: string, label: string };

export interface Form {
  DiveSiteName: string;
  SightingDate: string;
  Photos: string[];
  SeaLife: dropDownItem[];

}

export const FormRules: FormValidationRules<Form> = {
  DiveSiteName: {
    required: "Dive Site Name is required",
  },
  SightingDate: {
    required: "Date is required",
    validate: {
      validDate: (value) => {
        if (!value) return "Date is required";
        const date = moment(value, "YYYY-MM-DD", true);
        if (!date.isValid()) {
          return "Please enter a valid date";
        }
        if (date.isAfter(moment(), "day")) {
          return "Date cannot be in the future";
        }
        return true;
      }
    }
  },
  Photos: {
    required: "No Photos?",
  },
  SeaLife: {
    required: "You must specify sea life for all uploaded photos.",
    validate: {
      allDropdownsSelected: (seaLifeItems, formValues) => {
        if (seaLifeItems.length !== formValues.Photos.length) {
          return "Please select a sea life type for every photo.";
        }
        const allValid = seaLifeItems.every(item => item && item.key && item.key !== "");

        if (!allValid) {
          return "Please select a sea life type for all photos before proceeding.";
        }

        return true;
      }
    }
  },
};
