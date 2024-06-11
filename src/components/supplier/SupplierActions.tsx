import { ISupplier } from '@/types'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import React from 'react'
import Payments from './tabItems/Payments'
import Returns from './tabItems/Returns'
import Sells from './tabItems/Sells'

const onChange = (key: string) => {
  //   console.log(key)
}

interface SupplierActionsProps {
  supplier: ISupplier
}

const SupplierActions: React.FC<SupplierActionsProps> = ({ supplier }) => {
  // console.log(supplier)

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Sells',
      children: (
        <div style={{ padding: '15px' }}>
          <Sells supplier={supplier} />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Payments',
      children: <Payments />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: 'Returns',
      children: <Returns />,
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
}

export default SupplierActions
