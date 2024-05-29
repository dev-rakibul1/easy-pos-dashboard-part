import * as yup from 'yup'

export const CreatePurchaseYupSchema = yup.object().shape({
  purchaseRate: yup
    .number()
    .required('Purchase rate is required.')
    .min(0, { message: 'Purchase rate must be a non-negative number' }),
  sellingPrice: yup
    .number()
    .required('Selling price is required.')
    .min(0, { message: 'Selling price must be a non-negative number' }),
  discounts: yup
    .number()
    .min(0, { message: 'Discounts must be a non-negative number' })
    .optional(),
  vats: yup
    .number()
    .min(0, { message: 'VATs must be a non-negative number' })
    .optional(),
  totalPrice: yup
    .number()
    .required('Total price is required.')
    .min(0, { message: 'Total price must be a non-negative number' })
    .optional(),
  totalStock: yup
    .number()
    .min(0, { message: 'Total stock must be a non-negative number' })
    .optional(),
  color: yup.string().optional(),
  uniqueId: yup.string().optional(),

  supplierId: yup.string().required('Supplier id is required.'),
  // .uuid({ message: 'Invalid supplier id.' }),
  userId: yup.string().required('User id is required.').optional(),
  // .uuid({ message: 'Invalid user id.' }),
  productId: yup.string().required('Product id is required.'),
  // .uuid({ message: 'Invalid product id.' }),
})
