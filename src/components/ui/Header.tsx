'use client'

import { authKey } from '@/constants/storageKey'
import { isLoggedOut } from '@/services/auth.services'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import {
  Avatar,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
const { Header: AntdHeader } = Layout

const { Text } = Typography

const Header = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const logOut = () => {
    isLoggedOut(authKey)
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div
        style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
      >
        <Spin size="small" />
      </div>
    )
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Text onClick={logOut} strong>
          Logout
        </Text>
      ),
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <AntdHeader style={{ backgroundColor: 'rgb(233 233 233)' }}>
      <Row justify="end" align="middle" style={{ height: '100%' }}>
        <Dropdown menu={{ items }}>
          <a href="">
            <Space wrap size={16}>
              <Avatar size="small" icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </Row>
    </AntdHeader>
  )
}

export default Header
