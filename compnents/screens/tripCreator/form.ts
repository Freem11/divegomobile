
import { FormValidationRules } from '../../../forms/form';

export interface Form {
  Name?:    string
  Link?:    string
  Price?:   string
  Start?:   string
  End?:     string
  Details?: string
}

export const FormRules: FormValidationRules<Form> =   {
  Name: {
    required: 'Trip name is required',
  },
  Link: {
    required: 'Link is required',
  },
  Price: {
    required: 'Price is required',
    min:      {
      value:   0,
      message: 'Price must be at least 0',
    },
    pattern:  /^\$\d+(\.\d{1,2})?$/,
  },
  Start: {
    required: 'Trip Start Date is required',
  },
  End: {
    required: 'Trip End Date is required',
  },
  Details: {
    required: 'Details is required',
  },
};
