'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ReturnInvoice from '@/components/return/ReturnReport'
import { flexBetween } from '@/components/styles/style'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { useGetSingleSupplierReturnPaymentQuery } from '@/redux/api/supplierReturnPayment/supplierReturnPayemntApi'
import { getUserInfo } from '@/services/auth.services'
import { PrinterOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const ReturnReportPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id
  const { data } = useGetSingleSupplierReturnPaymentQuery(paramsId)
  const supplierId = data?.supplierId
  const { data: supplier } = useGetSingleSupplierQuery(supplierId)

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  console.log(data)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Return list`,
            link: `/${role}/return-lists/`,
          },
          {
            label: `Report`,
            // @ts-ignore
            link: `/${role}/return-lists/report/${params?.id}`,
          },
        ]}
      />

      <div style={flexBetween}>
        <ActionBar title="Report details"></ActionBar>
        <Button onClick={handlePrint}>
          {' '}
          Print <PrinterOutlined />
        </Button>
      </div>
      <div style={{ marginTop: '15px' }}>
        <ReturnInvoice
          id={paramsId}
          supplier={supplier}
          componentRef={componentRef}
        />
      </div>
    </div>
  )
}

export default ReturnReportPage
