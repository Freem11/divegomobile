import { FormValidationRules } from "../../utils/forms";

export interface Form {
  id?: number;
  name?: string;
  bio?: string;
  uri?: string | null
}

export const FormRules: FormValidationRules<Form> = {
  name: {
    required: "name is required",
  },
};
