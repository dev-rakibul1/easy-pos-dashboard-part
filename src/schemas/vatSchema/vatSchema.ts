import * as yup from 'yup'

// Update Vat validation
export const UpdateVatsYupValidation = yup.object({
  name: yup.string().required('Vat name is required.'),
  vatType: yup.string().required('Vat type is required.'),
  vatValue: yup
    .number()
    .required('Vat value is required.')
    .typeError('Vat value must be a number'),
})
