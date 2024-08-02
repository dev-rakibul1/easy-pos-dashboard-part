'use client'

import { authKey } from '@/constants/storageKey'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo, isLoggedOut } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { LogoutOutlined } from '@ant-design/icons'
import { Dropdown, Layout, MenuProps, Row, Space, Spin, Typography } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiProfileLine } from 'react-icons/ri'
import { ImageStyle } from '../styles/style'
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
            <Image
              width={80}
              height={80}
              // layout="responsive"
              alt="supplier"
              src={
                data?.profileImage
                  ? `${data?.profileImage}`
                  : 'https://via.placeholder.com/80'
              }
              style={ImageStyle}
            />
          </Space>
          {/* </a> */}
        </Dropdown>
      </Row>
    </AntdHeader>
  )
}

export default Header
