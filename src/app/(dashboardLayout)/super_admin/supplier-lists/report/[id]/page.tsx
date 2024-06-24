'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import SupplierReport from '@/components/supplier/SupplierReport'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierSellProductQuery } from '@/redux/api/supplierSellProducts/supplierSellProducts'
import { useGetSingleSupplierSellQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { getUserInfo } from '@/services/auth.services'

const SupplierSellReport = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id

  const { data } = useGetSingleSupplierSellQuery(paramsId)
  const id = data?.productId
  const { data: supplierSellProduct } = useGetSingleSupplierSellProductQuery(id)
  console.log({supplierSellProduct})
  console.log({data})

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
      <SupplierReport
        apiResponse={data}
        supplierSellProduct={supplierSellProduct}
        id={paramsId}
      />
    </div>
  )
}

export default SupplierSellReport
