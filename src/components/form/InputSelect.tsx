'use client'

import { Select } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'

type ISelectOptions = {
  label: string
  value: string
}

const inputStyle = {
  borderRadius: '0',
  boxShadow: 'none',
  outline: 'none',
  border: '1px solid rgb(213 213 213)',
  width: '100%',
}

interface ISelectFieldProps {
  options: ISelectOptions[]
  name: string
  size?: 'small' | 'large'
  value?: string | string[] | undefined
  placeholder?: string
  label?: string
  optionFilterProp?: string
  defaultValue?: string
  addonAfter?: React.ReactNode
}

const InputSelect = ({
  name,
  size,
  placeholder,
  label,
  defaultValue,
  options,
  optionFilterProp = 'label',
  addonAfter,
}: ISelectFieldProps) => {
  const { control } = useFormContext()

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <div style={{ marginBottom: '24px' }}>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ddd',
            }}
          >
            <Select
              style={inputStyle}
              showSearch
              size={size}
              placeholder={placeholder}
              defaultValue={defaultValue}
              value={value}
              onChange={onChange}
              filterOption={filterOption}
              options={options}
              optionFilterProp={optionFilterProp}
            />
            {addonAfter && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 10px',
                  borderLeft: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                // @ts-ignore
                onClick={() => addonAfter && addonAfter?.props.onClick()}
              >
                {addonAfter}
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default InputSelect
