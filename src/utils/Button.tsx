'use client'

import { Button as AntButton, ButtonProps } from 'antd' // Import Ant Design Button and ButtonProps

import React from 'react'

const buttonStyle = {
  borderRadius: '0',
  boxShadow: 'none',
  outline: 'none',
}

const CustomButton: React.FC<ButtonProps> = props => {
  return (
    <AntButton style={{ ...buttonStyle, ...props.style }} {...props}>
      {props.children}
    </AntButton>
  )
}

export default CustomButton
