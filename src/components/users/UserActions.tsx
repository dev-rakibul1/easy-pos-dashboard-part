import { IUser } from '@/types'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import React from 'react'
import Payments from '../supplier/tabItems/Payments'
import Purchase from './tabs/Purchase'
import Returns from './tabs/Returns'

const onChange = (key: string) => {
  //   console.log(key)
}

interface SupplierActionsProps {
  user: IUser
}

const UserActions: React.FC<SupplierActionsProps> = ({ user }) => {
  // console.log(supplier)

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Purchase',
      children: (
        <div style={{ padding: '15px' }}>
          <Purchase user={user} />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Payments',
      children: <Payments />,
    },

    {
      key: '4',
      label: 'Returns',
      children: <Returns user={user} />,
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
}

export default UserActions
