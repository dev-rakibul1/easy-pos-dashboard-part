'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import { flexBetween } from '@/components/styles/style'
import SupplierReport from '@/components/supplier/SupplierReport'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierSellQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { getUserInfo } from '@/services/auth.services'
import { PrinterOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const SupplierSellReport = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id

  const { data } = useGetSingleSupplierSellQuery(paramsId)
  const supplier = data?.supplier

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Supplier list`,
            link: `/${role}/supplier-lists/`,
          },
          {
            label: `Report`,
            // @ts-ignore
            link: `/${role}/supplier-lists/report/${params?.id}`,
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
        <SupplierReport
          id={paramsId}
          supplier={supplier}
          componentRef={componentRef}
        />
      </div>
    </div>
  )
}

export default SupplierSellReport
