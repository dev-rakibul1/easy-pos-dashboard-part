import { emailRegex } from '@/constants/global'
import * as yup from 'yup'

export const CreateUserYupSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 character long')
    .max(55, 'First name must be less than or equal to 55 characters'),
  middleName: yup
    .string()
    .max(55, 'Middle name must be less than or equal to 55 characters')
    .optional(),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 character long')
    .max(255, 'Last name must be less than or equal to 255 characters'),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address'),
  phoneNo: yup.number().required('Phone number is required'),
  // .max(15, 'Phone number must be less than or equal to 15 characters'),
  nid: yup
    .number()
    // .max(20, 'NID must be less than or equal to 20 characters')
    .optional(),
  presentAddress: yup
    .string()
    .max(255, 'Present address must be less than or equal to 255 characters')
    .optional(),
  permanentAddress: yup
    .string()
    .max(255, 'Permanent address must be less than or equal to 255 characters')
    .optional(),
  file: yup.mixed().optional(),

  password: yup.string().optional(),
})
