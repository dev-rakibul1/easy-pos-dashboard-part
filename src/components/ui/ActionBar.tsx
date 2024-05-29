import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography

type IActionBar = {
  title?: string
  children?: React.ReactNode
}

const ActionBar = ({ title, children }: IActionBar) => {
  return (
    <div>
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ActionBar
