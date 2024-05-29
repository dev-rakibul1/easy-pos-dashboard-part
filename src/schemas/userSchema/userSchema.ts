import { emailRegex } from '@/constants/global'
import * as yup from 'yup'

export const CreateUserYupSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(25, { message: 'First name cannot exceed 25 characters' }),

  middleName: yup
    .string()
    .max(25, { message: 'Middle name cannot exceed 25 characters' })
    .optional(),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(25, { message: 'Last name cannot exceed 25 characters' }),

  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address!'),

  phoneNo: yup
    .string()
    .required('Phone number is required')
    .min(1, { message: 'Phone number is required' })
    .max(20, { message: 'Phone number cannot exceed 20 characters' }),

  gender: yup
    .string()
    .max(50, { message: 'Gender cannot exceed 50 characters' })
    .optional(),

  nid: yup
    .string()
    .max(50, { message: 'NID cannot exceed 50 characters' })
    .optional(),

  presentAddress: yup
    .string()
    .max(255, { message: 'Present address cannot exceed 255 characters' })
    .optional(),

  permanentAddress: yup
    .string()
    .max(255, { message: 'Permanent address cannot exceed 255 characters' })
    .optional(),

  profileImage: yup
    .string()
    .url({ message: 'Invalid URL' })
    .max(255, { message: 'Profile image URL cannot exceed 255 characters' })
    .optional(),

  password: yup.string().optional(),
})
