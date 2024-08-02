import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Image, Row, Typography } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles by default
import { ImageStyle } from '../styles/style'
import SupplierUI from './SupplierUI'

const { Title, Paragraph } = Typography

const PurchaseDetails = ({ purchase }: any) => {
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card
            cover={
              <Image
                width={120}
                height={120}
                alt={purchase?.productName ? purchase?.productName : 'N/A'}
                src={
                  purchase?.products?.productImage
                    ? `http://localhost:7000${purchase?.products?.productImage}`
                    : 'https://via.placeholder.com/120'
                }
                style={ImageStyle}
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
            {purchase?.products?.productName
              ? purchase?.products?.productName
              : 'N/A'}
          </Title>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Model">
              {purchase?.products?.modelName
                ? `${purchase?.products?.modelName}`
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ram">
              {purchase?.ram ? `${purchase?.ram} GB` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Room">
              {purchase?.room ? `${purchase?.room} GB` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Color">
              {purchase?.color ? purchase?.color : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Purchase Rate">
              {purchase?.purchaseRate ? purchase?.purchaseRate : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="Selling Price">
              {purchase?.sellingPrice ? purchase?.sellingPrice : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="Vats">
              {purchase?.vats ? `${purchase?.vats} %` : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="Discounts">
              {purchase?.discounts ? `${purchase?.discounts} %` : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="Product Count">
              {purchase?.productStock
                ? `${purchase?.productStock} pics`
                : '0 pics'}
            </Descriptions.Item>
            <Descriptions.Item label="Others Count">
              {purchase?.othersStock
                ? `${purchase?.othersStock} pics`
                : '0 pics'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              {purchase?.totalPrice ? purchase?.totalPrice : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {purchase?.uniqueId ? purchase?.uniqueId : 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label="Created At">
              {purchase?.createdAt
                ? new Date(purchase?.createdAt).toLocaleString()
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {purchase?.updatedAt
                ? new Date(purchase?.updatedAt).toLocaleString()
                : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <div>
        <SupplierUI purchase={purchase} />
      </div>
    </div>
  )
}

export default PurchaseDetails
