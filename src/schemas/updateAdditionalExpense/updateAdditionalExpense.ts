import * as yup from 'yup'

// Update additional expense validation
export const UpdateAdditionalExpenseYupValidation = yup.object({
  expenseAmount: yup.string().required('Expanse amount is require.'),
  details: yup.string().optional(),
})
