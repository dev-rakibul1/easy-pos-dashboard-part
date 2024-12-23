'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ProductDetails from '@/components/product/ProductDetails'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleProductQuery } from '@/redux/api/productApi/productApi'
import { getUserInfo } from '@/services/auth.services'
import { Spin } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles by default

const ProductDetailsPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { isLoading, data } = useGetSingleProductQuery(id)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Product list`,
            link: `/${role}/product-list`,
          },
          {
            label: `Details`,
            // @ts-ignore
            link: `/${role}/product-list/details/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Product details"></ActionBar>
      {isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <ProductDetails product={data} />
      )}
    </div>
  )
}

export default ProductDetailsPage
