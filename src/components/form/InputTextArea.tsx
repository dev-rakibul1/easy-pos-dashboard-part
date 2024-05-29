'use client'

import { Input } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'

interface IInput {
  name: string
  type?: string
  size?: 'large' | 'small'
  value?: string | string[] | undefined
  validation?: object
  label?: string
  rows?: number
}

const InputTextAreaFields = ({
  name,
  type,
  size,
  value,
  rows,
  validation,
  label,
}: IInput) => {
  const { control } = useFormContext()

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input.TextArea rows={rows} {...field} defaultValue={value} />
        )}
      />
    </>
  )
}

export default InputTextAreaFields
