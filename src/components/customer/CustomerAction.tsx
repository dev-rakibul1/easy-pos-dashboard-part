import { ICustomer } from '@/types'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import React from 'react'
import Payments from '../supplier/tabItems/Payments'
import Returns from '../supplier/tabItems/Returns'
import Purchase from './tabs/Purchase'

const onChange = (key: string) => {
  //   console.log(key)
}

interface CustomerActionsProps {
  customer: ICustomer
}

const CustomerActions: React.FC<CustomerActionsProps> = ({ customer }) => {
  console.log(customer)

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Purchase',
      children: (
        <div style={{ padding: '15px' }}>
          <Purchase customer={customer} />
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
      children: <Returns />,
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
}

export default CustomerActions
