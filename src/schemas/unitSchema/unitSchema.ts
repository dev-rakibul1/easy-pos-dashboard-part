import * as yup from 'yup'

// Update Unit validation
export const UpdateUnitYupValidation = yup.object({
  unitName: yup.string().required('Unit name is require.'),
})
