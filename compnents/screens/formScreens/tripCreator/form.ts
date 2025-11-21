import { FormValidationRules } from "../../../../forms/form";

export interface Form {
  Name?: string
  Link?: string
  Price?: string
  Start?: string
  End?: string
  Details?: string
  SiteList?: number[]
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export const FormRules: FormValidationRules<Form> = {
  Name: {
    required: "Trip name is required",
  },
  Link: {
    required: "Link is required",
  },
  Price: {
    required: "Price is required",
    min: {
      value: 0,
      message: "Price must be at least 0",
    },
    pattern: {
      value: /^\$\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
      message: "Enter a valid price",
    }
  },
  Start: {
    required: "Trip Start Date is required",
    validate: {
      notPast: (value) => {
        const startDate = new Date(value as string);
        return startDate >= today || "Start date cannot be in the past";
      },
      beforeEnd: (value, formValues) => {
        if (!formValues.End) return true;
        const startDate = new Date(value as string);
        const endDate = new Date(formValues.End);
        return startDate <= endDate || "Start date cannot be after the End date";
      },
    }
  },
  End: {
    required: "Trip End Date is required",
    validate: {
      notPast: (value) => {
        const endDate = new Date(value as string);
        return endDate >= today || "End date cannot be in the past";
      },
      afterStart: (value, formValues) => {
        if (!formValues.Start) return true;
        const startDate = new Date(formValues.Start);
        const endDate = new Date(value as string);
        return endDate >= startDate || "End date must be after the Start date";
      },
    }
  },
  Details: {
    required: "Details is required",
  },
};
