import * as Yup from 'yup'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CreateSupplierYupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .max(25, 'First name cannot exceed 25 characters'),

  middleName: Yup.string()
    .max(25, 'Middle name cannot exceed 25 characters')
    .nullable(),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .max(25, 'Last name cannot exceed 25 characters'),
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address'),

  phoneNo: Yup.string()
    .required('Phone number is required')
    .max(20, 'Phone number cannot exceed 20 characters'),

  gender: Yup.string().max(25, 'Gender cannot exceed 25 characters').nullable(),

  nid: Yup.string().max(25, 'NID cannot exceed 25 characters').nullable(),

  presentAddress: Yup.string()
    .max(255, 'Present address cannot exceed 255 characters')
    .nullable(),

  permanentAddress: Yup.string()
    .max(255, 'Permanent address cannot exceed 255 characters')
    .nullable(),
  profileImage: Yup.string()
    .url('Invalid URL')
    .max(255, 'Profile image URL cannot exceed 255 characters')
    .nullable()
    .optional(),
})

export default CreateSupplierYupSchema
