import moment from "moment";

import { FormValidationRules } from "../../../utils/forms";

// Updated to match the object structure required by DynamicSelect and our AI logic
type dropDownItem = {
  key: string;
  label: string;
  value?: string;
  aiOriginal?: dropDownItem | null; // The Shadow Lane
};

export interface Form {
  DiveSiteName: string;
  SightingDate: Date; // Changed to Date to match your DatePicker usage
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
        const date = moment(value);
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
    validate: {
      validatePhotoCount: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return "Sea Life photos are needed to proceed";
        }
        return true;
      }
    }
  },
  SeaLife: {
    validate: {
      allDropdownsSelected: (seaLifeItems, formValues) => {
        // Ensure we have an entry for every photo
        if (!seaLifeItems || seaLifeItems.length !== formValues.Photos.length) {
          return "Please select a sea life type for every photo.";
        }

        // Check that every item has a valid key and isn't stuck in "loading"
        const allValid = seaLifeItems.every(
          item => item && item.key && item.key !== "" && item.key !== "loading"
        );

        if (!allValid) {
          return "Please wait for identification or select a species manually.";
        }

        return true;
      }
    }
  },
};