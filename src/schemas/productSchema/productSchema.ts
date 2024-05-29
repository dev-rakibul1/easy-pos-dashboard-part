import * as yup from 'yup'

export const createProductYupValidation = yup.object().shape({
  productName: yup
    .string()
    .required('Product name is required')
    .min(5, 'Product name must be at least 5 characters long')
    .max(255, 'Product name must be less than or equal to 255 characters'),
  brandName: yup
    .string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters long')
    .max(255, 'Brand name must be less than or equal to 255 characters'),
  modelName: yup
    .string()
    .required('Model name is required')
    .max(255, 'Model name must be less than or equal to 255 characters'),
  processor: yup
    .string()
    .min(5, 'Processor must be at least 5 characters long')
    .max(255, 'Processor must be less than or equal to 255 characters')
    .optional(),
  unit: yup
    .string()
    .required('Unit is required')
    .max(255, 'Unit must be less than or equal to 255 characters'),
  category: yup
    .string()
    .required('Category is required')
    .max(255, 'Category must be less than or equal to 255 characters'),
  reOrderAlert: yup
    .number()
    .integer('Reorder alert must be an integer')
    .min(0, 'Reorder alert must be a non-negative integer'),
  productImage: yup
    .string()
    .max(255, 'Product image must be less than or equal to 255 characters')
    .optional(),
  description: yup
    .string()
    .max(1000, 'Description must be less than or equal to 1000 characters')
    .optional(),
  uniqueId: yup
    .string()
    .max(255, 'Unique ID must be less than or equal to 255 characters')
    .optional(),
  productStock: yup
    .number()
    .integer('Product stock must be an integer')
    .min(0, 'Product stock must be a non-negative integer')
    .optional(),
  othersStock: yup
    .number()
    .integer('Others stock must be an integer')
    .min(0, 'Others stock must be a non-negative integer')
    .optional(),
})
