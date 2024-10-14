'use client'

import { authKey } from '@/constants/storageKey'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo, isLoggedOut } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { placeholderImage } from '@/utils/placeholderImage/placeholderImage'
import { LogoutOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space, Spin, Typography } from 'antd'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiProfileLine } from 'react-icons/ri' // Ensure you have these icon imports
import { NavbarDropdown, NavbarStyle } from '../styles/style'

const { Text } = Typography

const Profile = () => {
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

  // Sample notifications, modify or fetch from your data source
  const notifications = [
    {
      key: '0',
      label: <Text strong>Profile</Text>,
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
    // Add more notifications as needed
  ]

  // Create a dropdown menu from notifications
  const dropdownMenu = (
    <Menu>
      {notifications.slice(0, 10).map(notification => (
        <Menu.Item key={notification.key}>
          <Space>
            {notification.icon}
            {notification.label}
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      overlayStyle={{ maxWidth: '250px', width: '150px' }}
    >
      <Space wrap size={16} style={NavbarStyle}>
        {/* <Avatar size="small" icon={<UserOutlined />} /> */}
        <Image
          width={40}
          height={40}
          // layout="responsive"
          alt="supplier"
          src={data?.profileImage ? `${data?.profileImage}` : placeholderImage}
          style={NavbarDropdown}
        />
      </Space>
    </Dropdown>
  )
}

export default Profile
