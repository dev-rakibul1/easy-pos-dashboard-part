import * as yup from 'yup'

export const CreateLoginAuthValidation = yup.object().shape({
  uniqueId: yup
    .string()
    .required('UniqueId is required.')
    .matches(/^U-\d{5}$/, 'UniqueId must be in the format U-00001.'),
  password: yup
    .string()
    .required('Password is required.')
    .test(
      'nonempty',
      'Password cannot be an empty value.',
      value => value.trim() !== ''
    )
    .min(6, 'Password must be at least 6 characters long.'),
})
