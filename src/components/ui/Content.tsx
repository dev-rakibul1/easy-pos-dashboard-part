'use client'

import { Layout } from 'antd'
import React from 'react'
import PosBreadcrumb from '../breadcrumb/PosBreadcrumb'
import Header from './Header'
const { Content } = Layout

const base = 'admin'

const Contents = ({ children }: { children: React.ReactNode }) => {
  return (
    <Content style={{ minHeight: '100vh' }}>
      <Header />

      <PosBreadcrumb
        items={[
          {
            label: `${base}`,
            link: `/${base}`,
          },
          {
            label: `user`,
            link: `/${base}/user`,
          },
        ]}
      />
      {children}
    </Content>
  )
}

export default Contents
