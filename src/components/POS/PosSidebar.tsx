import { useGetAllStockInProductQuery } from '@/redux/api/productApi/productApi'
import { useGetAllVariantsQuery } from '@/redux/api/variantApi/variantApi'
import { IProduct } from '@/types'
import { List, Spin, Typography } from 'antd'
const { Text, Title } = Typography

const PosSidebar = () => {
  const { data: variantData, isLoading: variantLoading } =
    useGetAllVariantsQuery({ pollingInterval: 15000 })
  const { data: productData, isLoading: productLoading } =
    useGetAllStockInProductQuery({ pollingInterval: 15000 })

  // @ts-ignore
  const products: IProduct[] = productData?.products || []

  return (
    <div style={{ border: '1px solid #ddd', padding: '8px', margin: '8px' }}>
      {variantLoading || productLoading ? (
        <Spin size="small" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <div>
          <Title level={4}>Stock in product</Title>
          <Text strong>Total stock: </Text>
          {variantData?.meta?.total} pics
          <List
            itemLayout="horizontal"
            dataSource={products}
            renderItem={(product: IProduct) => (
              <List.Item>
                <List.Item.Meta
                  title={`${product.productName} | ${product.uniqueId}`}
                  description={`Variants: ${
                    product.variants ? product.variants.length : 0
                  } pics`}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}

export default PosSidebar
