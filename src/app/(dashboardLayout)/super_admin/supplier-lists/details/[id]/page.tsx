'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import SupplierUI from '@/components/supplier/SupplierUI'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { getUserInfo } from '@/services/auth.services'
import { Spin } from 'antd'

const SupplierDetailsPage = ({ params }: any) => {
  const { id } = params
  const { data, isLoading } = useGetSingleSupplierQuery(id)
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

      {isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <SupplierUI supplier={data} />
      )}
    </div>
  )
}

export default SupplierDetailsPage
