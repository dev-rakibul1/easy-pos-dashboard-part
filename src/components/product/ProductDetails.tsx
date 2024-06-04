import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Image, Row, Typography } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles by default
import ActionBar from '../ui/ActionBar'
import ProductVariants from './ProductVariants'

const { Title, Paragraph } = Typography

const ProductDetails = ({ product, variant }: any) => {
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card
            cover={
              <Image
                alt={product?.productName ? product?.productName : 'Empty'}
                src={
                  product?.productImage
                    ? `http://localhost:7000${product?.productImage}`
                    : 'https://via.placeholder.com/300'
                }
                style={{ width: '100%' }}
              />
            }
          >
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={{ marginRight: 8 }}
            >
              Add to Cart
            </Button>
            <Button type="default" icon={<HeartOutlined />}>
              Add to Wishlist
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Title level={2}>
            {product?.productName ? product?.productName : 'Empty'}
          </Title>
          <Paragraph>
            {product?.description ? product?.description : 'Empty'}
          </Paragraph>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Brand">
              {product?.brandName ? product?.brandName : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {product?.modelName ? product?.modelName : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Processor">
              {product?.processor ? product?.processor : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {product?.category ? product?.category : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Unit">
              {product?.unit ? product?.unit : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Re-order Alert">
              {product?.reOrderAlert ? product?.reOrderAlert : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {product?.uniqueId ? product?.uniqueId : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Product Stock">
              {product?.productStock !== undefined
                ? product?.productStock
                : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Other Stock">
              {product?.othersStock !== undefined
                ? product?.othersStock
                : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {product?.createdAt
                ? new Date(product?.createdAt).toLocaleString()
                : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {product?.updatedAt
                ? new Date(product?.updatedAt).toLocaleString()
                : 'Empty'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {!product?.variants ? (
        <h3>Product variant not available</h3>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <ActionBar title="Variants details" />
          <ProductVariants variant={product?.variants} />
        </div>
      )}
    </div>
  )
}

export default ProductDetails
