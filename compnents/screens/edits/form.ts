import { i18n } from "../../../i18n";
import { FormValidationRules } from "../../utils/forms";

export interface Form {
  id?: number;
  name?: string;
  bio?: string;
  photo?: string | null;
  uri?: string | null
}

export const FormRules: FormValidationRules<Form> = {
  name: {
    required: "name is required",
  },
};
