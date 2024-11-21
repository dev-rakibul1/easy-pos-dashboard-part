'use client'

import sidebarItems from '@/constants/sidebarItems'
import { getUserInfo } from '@/services/auth.services'
import { ConfigProvider, Layout, Menu } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '../shared/icon/Logo'

const { Sider } = Layout

const linkedinFullColorPalette = {
  colorPrimary: '#0077b5', // LinkedIn blue
  colorPrimaryLight: '#e8f4f9', // Very light blue background
  colorPrimaryDark: '#003c71', // Darker blue for hover or accents
  colorTextPrimary: '#000000', // Main text color
  colorTextSecondary: '#434649', // Secondary text color
  colorWarning: '#ffc107', // Warning color
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { role } = getUserInfo() as any

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: linkedinFullColorPalette.colorPrimary,
          colorWarning: linkedinFullColorPalette.colorWarning,
          colorText: linkedinFullColorPalette.colorTextPrimary,
        },
      }}
    >
      <Sider
        collapsible
        theme="light" // Use "light" or "dark" for Sider themes
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        width={250}
        style={{
          backgroundColor: linkedinFullColorPalette.colorPrimaryLight,
          color: linkedinFullColorPalette.colorTextPrimary,
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: '19px',
            textAlign: 'center',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '15px',
            color: linkedinFullColorPalette.colorPrimaryDark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo /> <span style={{ paddingLeft: '15px' }}>Easy POS</span>
        </Link>
        <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          style={{
            background: linkedinFullColorPalette.colorPrimaryLight,
            color: linkedinFullColorPalette.colorTextSecondary,
          }}
          items={sidebarItems(role)}
        />
      </Sider>
    </ConfigProvider>
  )
}

export default Sidebar
