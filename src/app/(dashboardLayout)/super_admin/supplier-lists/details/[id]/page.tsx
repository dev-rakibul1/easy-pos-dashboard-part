'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import SupplierActions from '@/components/supplier/SupplierActions'
import SupplierUI from '@/components/supplier/SupplierUI'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { getUserInfo } from '@/services/auth.services'
import { Spin, Tabs, TabsProps } from 'antd' // Ensure Spin is imported

const SupplierDetailsPage = ({ params }: any) => {
  const { id } = params
  const { data, isLoading } = useGetSingleSupplierQuery(id)
  const { role } = getUserInfo() as any
  const onChange = (key: string) => {
    // console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Supplier information',
      children: isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <SupplierUI supplier={data} />
      ),
    },
    {
      key: '2',
      label: 'Supplier sales',
      children: <SupplierActions supplier={data} />,
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
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default SupplierDetailsPage
