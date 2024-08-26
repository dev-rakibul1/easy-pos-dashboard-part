import { placeholderImage } from '@/utils/placeholderImage/placeholderImage'
import { Card, Col, Descriptions, Divider, Row, Typography } from 'antd'
import Image from 'next/image'
import { ImageStyle } from '../styles/style'
import './PurchaseStyle.css'

const { Title, Text } = Typography

const SupplierUI = ({ purchase }: any) => {
  // console.log(purchase)
  return (
    <Card className="profile-card" style={{ width: '100%', marginTop: '15px' }}>
      <Row justify="center" align="middle">
        <Col>
          <Image
            width={120}
            height={120}
            // layout="responsive"
            alt="supplier"
            src={
              purchase?.suppliers?.profileImage
                ? `${purchase?.suppliers?.profileImage}`
                : placeholderImage
            }
            style={ImageStyle}
          />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col>
          <Title level={4}>
            {purchase?.suppliers?.firstName}{' '}
            {purchase?.suppliers?.middleName === null
              ? ''
              : purchase?.suppliers?.middleName}{' '}
            {purchase?.suppliers?.lastName}
          </Title>
          <Text type="secondary">Supplier Information</Text>
          {/* <Text type="secondary">Los Angeles, California, USA</Text> */}
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
          <Descriptions
            title="Personal Information"
            column={1}
            layout="horizontal"
            bordered
            style={{ width: '100%' }}
          >
            <Descriptions.Item label="First Name">
              {' '}
              {purchase?.suppliers?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Middle Name">
              {' '}
              {purchase?.suppliers?.middleName
                ? purchase?.suppliers?.middleName
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {' '}
              {purchase?.suppliers?.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email address">
              {purchase?.suppliers?.email ? purchase?.suppliers?.email : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {' '}
              {purchase?.suppliers?.phoneNo
                ? purchase?.suppliers?.phoneNo
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {' '}
              {purchase?.suppliers?.uniqueId
                ? purchase?.suppliers?.uniqueId
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="NID">
              {' '}
              {purchase?.suppliers?.nid ? purchase?.suppliers?.nid : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {' '}
              {purchase?.suppliers?.gender
                ? purchase?.suppliers?.gender
                : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
          <Descriptions
            title="Address"
            column={1}
            layout="horizontal"
            bordered
            style={{ width: '100%' }}
          >
            <Descriptions.Item label="Country">N/A</Descriptions.Item>
            <Descriptions.Item label="City / State">N/A</Descriptions.Item>
            <Descriptions.Item label="Postal Code">N/A</Descriptions.Item>
            <Descriptions.Item label="TAX ID">N/A</Descriptions.Item>
            <Descriptions.Item label="Present address">
              {' '}
              {purchase?.suppliers?.presentAddress
                ? purchase?.suppliers?.presentAddress
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Permanent address">
              {' '}
              {purchase?.suppliers?.permanentAddress
                ? purchase?.suppliers?.permanentAddress
                : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider />
    </Card>
  )
}

export default SupplierUI
