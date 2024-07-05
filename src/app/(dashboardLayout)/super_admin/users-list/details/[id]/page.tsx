'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import UserActions from '@/components/users/UserActions'
import UserUi from '@/components/users/UserUi'
import { useGetSingleUserByIdQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { Spin, Tabs, TabsProps } from 'antd' // Ensure Spin is imported

const UserDetailsPage = ({ params }: any) => {
  const { id } = params
  // console.log(id)
  const { data, isLoading } = useGetSingleUserByIdQuery(id)
  const { role } = getUserInfo() as any
  const onChange = (key: string) => {
    // console.log(key)
  }

  // console.log('user data', data)

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'User information',
      children: isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <UserUi user={data} />
      ),
    },
    {
      key: '2',
      label: 'User purchase',
      children: <UserActions user={data} />,
    },
  ]
  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Users list`,
            link: `/${role}/users-list/`,
          },
          {
            label: `Details`,
            // @ts-ignore
            link: `/${role}/users-list/details/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="User details"></ActionBar>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default UserDetailsPage
