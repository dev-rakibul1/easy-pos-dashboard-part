'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import Delivery from '@/components/warranty/tabs/Delivery'
import Pending from '@/components/warranty/tabs/Pending'
import {
  useGetAllDeliveryWarrantyQuery,
  useGetAllPendingWarrantyQuery,
} from '@/redux/api/warranty/warrantyApi'
import { getUserInfo } from '@/services/auth.services'
import { Tabs, TabsProps, Typography } from 'antd'
const { Title } = Typography

const WarrantyList = () => {
  const { role } = getUserInfo() as any
  const { data: pending, isLoading: pLoading } = useGetAllPendingWarrantyQuery({
    limit: 100,
    page: 1,
  })
  const { data: delivery } = useGetAllDeliveryWarrantyQuery({
    limit: 100,
    page: 1,
  })

  const onChange = (key: string) => {
    // console.log(key)
  }

  const pendingCount = pending?.meta?.total ? pending?.meta?.total : 0
  const deliveryCount = delivery?.meta?.total ? delivery?.meta?.total : 0

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Pending (${pendingCount})`,
      children: <Pending />,
    },
    {
      key: '2',
      label: `Delivery (${deliveryCount})`,
      children: <Delivery />,
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
            label: 'Warranty-list',
            link: `/${role}/warranty-list`,
          },
        ]}
      />

      <ActionBar title="Warranty list for pending and delivery" />

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default WarrantyList
