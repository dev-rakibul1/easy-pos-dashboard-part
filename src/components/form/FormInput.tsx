'use client'

import { Input } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'

interface IInput {
  name: string
  type?: string
  size?: 'small' | 'large'
  value?: string | string[] | undefined
  id?: string
  placeholder?: string
  validate?: object
  label?: string
  addonAfter?: React.ReactNode
}

const inputStyle = {
  borderRadius: '0',
  boxShadow: 'none',
  outline: 'none',
  border: '1px solid rgb(213 213 213)',
}

const FormInput = ({
  name,
  type,
  id,
  size,
  placeholder,
  validate,
  value,
  label,
  addonAfter,
}: IInput) => {
  const { control } = useFormContext()

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === 'password' ? (
            <Input.Password
              id={id}
              size={size}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
              style={inputStyle}
            />
          ) : addonAfter ? (
            <Input
              id={id}
              type={type}
              size={size}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
              style={inputStyle}
              addonAfter={addonAfter}
            />
          ) : (
            <Input
              id={id}
              type={type}
              size={size}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
              style={inputStyle}
            />
          )
        }
      />
    </>
  )
}

export default FormInput
