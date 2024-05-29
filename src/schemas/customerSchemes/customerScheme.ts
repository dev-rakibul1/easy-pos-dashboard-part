import { emailRegex } from '@/constants/global'
import * as yup from 'yup'

export const CreateCustomerYupSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, { message: 'First name must be at least 2 character long' })
    .max(55, {
      message: 'First name must be less than or equal to 55 characters',
    }),
  middleName: yup
    .string()
    .max(55, {
      message: 'Middle name must be less than or equal to 55 characters',
    })
    .optional(),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, { message: 'Last name must be at least 2 character long' })
    .max(255, {
      message: 'Last name must be less than or equal to 255 characters',
    }),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address'),
  phoneNo: yup
    .string()
    .required('Phone number is required')
    .min(1, { message: 'Phone number must be at least 1 character long' })
    .max(15, {
      message: 'Phone number must be less than or equal to 15 characters',
    }),
  nid: yup
    .string()
    .max(20, { message: 'NID must be less than or equal to 20 characters' })
    .optional(),
  presentAddress: yup
    .string()
    .max(255, {
      message: 'Present address must be less than or equal to 255 characters',
    })
    .optional(),
  permanentAddress: yup
    .string()
    .max(255, {
      message: 'Permanent address must be less than or equal to 255 characters',
    })
    .optional(),
})
