'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import CustomerActions from '@/components/customer/CustomerAction'
import CustomerUi from '@/components/customer/CustomerUi'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleCustomerQuery } from '@/redux/api/customerApi/customerApi'
import { getUserInfo } from '@/services/auth.services'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'

const CustomerDetails = ({ params }: any) => {
  const { role } = getUserInfo() as any

  const id = params?.id

  const { data, isLoading } = useGetSingleCustomerQuery(id)

  const onChange = (key: string) => {
    // console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Customer information',
      children: <CustomerUi customer={data} />,
    },
    {
      key: '2',
      label: 'Customer purchase',
      children: <CustomerActions customer={data} />,
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
            label: `Customers list`,
            link: `/${role}/customers-list`,
          },
          {
            label: `Details`,
            link: `/${role}/customers-list/details/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Customer details"></ActionBar>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default CustomerDetails
