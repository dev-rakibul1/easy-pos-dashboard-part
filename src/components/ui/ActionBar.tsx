type IActionBar = {
  title?: string
  children?: string
}

import { Typography } from 'antd'

const { Title } = Typography

const ActionBar = ({ title, children }: IActionBar) => {
  return (
    <div>
      <Title level={4}>{title}</Title>
      <div style={{ display: 'flex' }}>{children} </div>
    </div>
  )
}

export default ActionBar
