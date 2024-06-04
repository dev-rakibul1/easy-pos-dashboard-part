'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ProductDetails from '@/components/product/ProductDetails'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleProductQuery } from '@/redux/api/productApi/productApi'
import { getUserInfo } from '@/services/auth.services'
import { Select, Spin, Typography } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles by default
const fakeImageURL = 'https://placekitten.com/200/300'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

type IUnitsData = {
  unitName: string
}

const productDetails = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '7px',
}

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
