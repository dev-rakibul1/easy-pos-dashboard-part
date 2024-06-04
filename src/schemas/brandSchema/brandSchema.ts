import * as yup from 'yup'

// Update Unit validation
export const UpdateBrandYupValidation = yup.object({
  brandName: yup.string().required('Brand name is require.'),
  description: yup.string().optional(),
})
