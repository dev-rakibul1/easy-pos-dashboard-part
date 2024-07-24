'use client'

import { authKey } from '@/constants/storageKey'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo, isLoggedOut } from '@/services/auth.services'
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
import { RiProfileLine } from 'react-icons/ri'
const { Header: AntdHeader } = Layout

const { Text } = Typography

const Header = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const { role, uniqueId: id } = getUserInfo() as any
  const { data } = useGetSingleUserQuery(id)

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

  // Redirect to add customer page
  const handleAddCustomer = () => {
    router.push(`/${role}/`)
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
        <Text onClick={handleAddCustomer} strong>
          Profile
        </Text>
      ),
      icon: <RiProfileLine />,
    },
    {
      key: '1',
      label: (
        <Text onClick={logOut} strong>
          Logout
        </Text>
      ),
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <AntdHeader
      style={{
        backgroundColor: 'rgb(233 233 233)',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
      }}
    >
      <Row justify="end" align="middle" style={{ height: '100%' }}>
        <Dropdown menu={{ items }}>
          {/* <a href=""> */}
          <Space wrap size={16} style={{ cursor: 'pointer' }}>
            {/* <Avatar size="small" icon={<UserOutlined />} /> */}

            <Avatar
              size={40}
              icon={<UserOutlined />}
              src={
                data?.profileImage
                  ? `http://localhost:7000${data?.profileImage}`
                  : 'https://via.placeholder.com/300'
              }
            />
          </Space>
          {/* </a> */}
        </Dropdown>
      </Row>
    </AntdHeader>
  )
}

export default Header
