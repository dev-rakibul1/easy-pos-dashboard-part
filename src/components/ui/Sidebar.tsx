'use client'

import sidebarItems from '@/constants/sidebarItems'
import { getUserInfo } from '@/services/auth.services'
import { Layout, Menu } from 'antd'
import { useState } from 'react'
const { Sider } = Layout

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const { role } = getUserInfo() as any

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          color: '#fff',
          fontSize: '19px',
          textAlign: 'center',
          fontWeight: 500,
          textTransform: 'uppercase',
          padding: '15px',
        }}
      >
        Easy pos
      </div>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        // style={{ background: 'none' }}
        items={sidebarItems(role)}
      />
    </Sider>
  )
}

export default Sidebar
