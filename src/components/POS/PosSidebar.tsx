import { useGetAllStockInProductQuery } from '@/redux/api/productApi/productApi'
import { useGetAllVariantsQuery } from '@/redux/api/variantApi/variantApi'
import { IProduct, IVariant } from '@/types'
import { List, Modal, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { ImWarning } from 'react-icons/im'
import {
  userInfoSupplierSpin,
  warningIconStyle,
  warningIconWrap,
} from '../styles/style'
const { Text, Title } = Typography

const PosSidebar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showReOrderLabelAlertModal = () => {
    setIsModalVisible(true)
  }

  const handleReOrderAlertOk = () => {
    setIsModalVisible(false)
  }

  const handleReOrderAlertCancel = () => {
    setIsModalVisible(false)
  }

  const { data: variantData, isLoading: variantLoading } =
    useGetAllVariantsQuery({
      limit: 100,
    })
  const { data: productData, isLoading: productLoading } =
    useGetAllStockInProductQuery({
      limit: 100,
    })

  // filter variants and other products
  //@ts-ignore
  const variants: IVariant[] = variantData?.variants
    ? variantData?.variants
    : []

  const actualProductVariants = variants?.filter(
    (variant: IVariant) => variant?.imeiNumber !== 'N/A'
  )
  const otherStock = variants?.filter(
    (variant: IVariant) => variant?.imeiNumber === 'N/A'
  )

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products: IProduct[] = productData?.products || []

  // Filter the product
  const lessReOrderLabelProduct = products?.filter(
    product =>
      product?.variants &&
      product?.variants.length < product?.reOrderAlert &&
      product?.variants.length > 0
  )

  useEffect(() => {
    products?.map((product: IProduct) => {
      if (
        product?.variants &&
        product?.variants.length < product?.reOrderAlert &&
        product?.variants.length > 0
      ) {
        showReOrderLabelAlertModal()
      }

      if (
        product?.variants &&
        product?.variants.length < product?.reOrderAlert &&
        product?.variants.length > 0
      ) {
        setTimeout(() => {
          showReOrderLabelAlertModal()
        }, 30000)
      } else if (product.variants && !product.variants.length) {
        false
      }
    })
  }, [products])

  return (
    <>
      <Modal
        title={false}
        visible={isModalVisible}
        onOk={handleReOrderAlertOk}
        onCancel={handleReOrderAlertCancel}
        okText="Oh! Ok"
        cancelText="Cancel"
      >
        <div style={{ width: '100%' }}>
          <div style={warningIconWrap}>
            <div style={warningIconStyle}>
              <ImWarning />
            </div>
          </div>
          <Text strong style={userInfoSupplierSpin}>
            Re-order label alert
          </Text>
          {lessReOrderLabelProduct?.map((product: IProduct, i) => (
            <div key={i + 1}>
              <p
                style={{
                  border: '1px solid #ddd',
                  padding: '5px',
                  marginTop: '7px',
                }}
              >
                {`Name: ${product?.productName} | last stock:
                ${product?.variants?.length}`}
                <audio src="/public/audio/alert.mp3"></audio>
              </p>
            </div>
          ))}
        </div>
      </Modal>
      <div style={{ border: '1px solid #ddd', padding: '8px', margin: '8px' }}>
        {variantLoading || productLoading ? (
          <Spin size="small" style={{ display: 'block', margin: '0 auto' }} />
        ) : (
          <div>
            <Title level={4}>Stock in product</Title>
            <Text strong> Product stock: </Text>
            {actualProductVariants?.length} pics
            <br />
            <Text strong>Others stock: </Text>
            {otherStock?.length} pics
            <br />
            <Text strong>Total stock: </Text>
            {variantData?.meta?.total} pics
            <br />
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
    </>
  )
}

export default PosSidebar
