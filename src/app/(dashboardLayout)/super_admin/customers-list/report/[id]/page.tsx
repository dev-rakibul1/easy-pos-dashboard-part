'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import CustomerReport from '@/components/customer/CustomerReport'
import { flexBetween } from '@/components/styles/style'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleCustomerPurchaseQuery } from '@/redux/api/customerPurchase/customerPurchaseApi'
import { getUserInfo } from '@/services/auth.services'
import { PrinterOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const CustomerPurchaseReport = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id

  const { data } = useGetSingleCustomerPurchaseQuery(paramsId)
  const customer = data?.customer
  console.log(customer)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Customer list`,
            link: `/${role}/customers-list/`,
          },
          {
            label: `Report`,
            // @ts-ignore
            link: `/${role}/Customers-list/report/${params?.id}`,
          },
        ]}
      />

      <div style={flexBetween}>
        <ActionBar title="Customer report details"></ActionBar>
        <Button>
          {' '}
          Print <PrinterOutlined />
        </Button>
      </div>
      <div style={{ marginTop: '15px' }}>
        <CustomerReport id={paramsId} customer={customer} />
        {/* <SupplierReport id={paramsId} supplier={customer} /> */}
      </div>
    </div>
  )
}

export default CustomerPurchaseReport
