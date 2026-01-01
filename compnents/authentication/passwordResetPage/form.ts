
import { FormValidationRules } from "../../../forms/form";
import { validationPassword } from "../../../forms/validation";

export interface Form {
  NewPass?: string
  ConfirmPass?: string
}

export const FormRules: FormValidationRules<Form> = {
  NewPass: {
    required: "A new password is required",
    ...validationPassword
  },
  ConfirmPass: {
    required: "Matching password is required",
    validate: {
      passesMatch: (value, formValues) => {
        const confirm = value;
        const original = formValues.NewPass;
        return confirm === original || "Passwords do not match!";
      },
    }
  }
};
