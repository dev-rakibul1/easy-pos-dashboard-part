'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import SupplierUI from '@/components/supplier/SupplierUI'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { getUserInfo } from '@/services/auth.services'

const SupplierDetailsPage = ({ params }: any) => {
  const { id } = params
  const { data } = useGetSingleSupplierQuery(id)
  //   console.log(data)
  const { role } = getUserInfo() as any
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
            label: `Details`,
            // @ts-ignore
            link: `/${role}/supplier-lists/details/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Supplier details"></ActionBar>

      <SupplierUI supplier={data} />
    </div>
  )
}

export default SupplierDetailsPage
