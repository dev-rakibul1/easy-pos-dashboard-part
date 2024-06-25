'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import SupplierReport from '@/components/supplier/SupplierReport'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierSellQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { getUserInfo } from '@/services/auth.services'

const SupplierSellReport = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id

  const { data } = useGetSingleSupplierSellQuery(paramsId)
  const supplier = data?.supplier

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

      <ActionBar title="Report details"></ActionBar>
      <SupplierReport id={paramsId} supplier={supplier} />
    </div>
  )
}

export default SupplierSellReport
