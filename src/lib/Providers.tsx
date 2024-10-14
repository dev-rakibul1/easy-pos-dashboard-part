'use client'

import { store } from '@/redux/store'
import { linkedinFullColorPalette } from '@/theme/theme'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import React from 'react'
import { Provider } from 'react-redux'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider theme={{ token: linkedinFullColorPalette }}>
      <Provider store={store}>
        <AntdRegistry>{children}</AntdRegistry>
      </Provider>
    </ConfigProvider>
  )
}

export default Providers
