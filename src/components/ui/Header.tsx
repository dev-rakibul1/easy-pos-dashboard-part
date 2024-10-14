'use client'

import { authKey } from '@/constants/storageKey'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo, isLoggedOut } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { LogoutOutlined } from '@ant-design/icons'
import { Layout, MenuProps, Row, Spin, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiProfileLine } from 'react-icons/ri'
import Profile from '../profile/Profile'
import { NavbarHeaderStyle } from '../styles/style'

import Message from '@/app/(dashboardLayout)/super_admin/message/page'
import NotificationDropdown from './Notification'
const { Header: AntdHeader } = Layout

const { Text } = Typography

const Header = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const { role, uniqueId: id } = getUserInfo() as ITokenObj
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
    <AntdHeader style={NavbarHeaderStyle}>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
        // justify="end"
        // align="middle"
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 15px',
          }}
        >
          <Message />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 15px',
          }}
        >
          <NotificationDropdown />
        </div>
        <div style={{ marginLeft: '15px' }}>
          <Profile />
        </div>
      </Row>
    </AntdHeader>
  )
}

export default Header
