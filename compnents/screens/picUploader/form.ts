import { i18n } from "../../../i18n";
import { FormValidationRules } from "../../utils/forms";

type dropDownItem = {
  key: string, label: string
}


export interface Form {
  date?: string;
  photo?: string | null;
  animal?: dropDownItem[];
  diveSiteName?: string;
}

export const FormRules: FormValidationRules<Form> = {
  animal: {
    required: i18n.t("Validators.whatYouSaw"),
  },
  date: {
    required: i18n.t("Validators.whenYouSaw"),
  },
  photo: {
    required: i18n.t("Validators.noPicture"),
  },
};
