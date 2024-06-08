'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import PurchaseDetails from '@/components/purchase/PurchaseDetails'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSinglePurchaseQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { getUserInfo } from '@/services/auth.services'
import { Spin } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles by default

const PurchaseDetailsPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { isLoading, data } = useGetSinglePurchaseQuery(id)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Purchase list`,
            link: `/${role}/purchase-list`,
          },
          {
            label: `Details`,
            // @ts-ignore
            link: `/${role}/purchase-list/details/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Purchase details"></ActionBar>
      {isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <PurchaseDetails purchase={data} />
      )}
    </div>
  )
}

export default PurchaseDetailsPage
