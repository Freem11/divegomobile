import { FieldValues, RegisterOptions } from "react-hook-form";

export type FormValidationRules<T extends FieldValues> = {
  [K in keyof T]?: RegisterOptions<T, any> | undefined;
};
