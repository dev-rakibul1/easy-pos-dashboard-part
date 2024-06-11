import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Descriptions, Divider, Row, Typography } from 'antd'
import SupplierActions from './SupplierActions'
import './SupplierUI'

const { Title, Text } = Typography

const SupplierUI = ({ supplier }: any) => {
  //   console.log('Supplier form Supplier UI pages', supplier)

  return (
    <>
      <Card
        className="profile-card"
        style={{ width: '100%', marginTop: '15px' }}
      >
        <Row justify="center" align="middle">
          <Col>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={
                supplier?.profileImage
                  ? `http://localhost:7000${supplier?.profileImage}`
                  : 'https://via.placeholder.com/300'
              }
              style={{ marginBottom: 16 }}
            />
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Col>
            <Title level={4}>
              {supplier?.firstName}{' '}
              {supplier?.middleName === null ? '' : supplier?.middleName}{' '}
              {supplier?.lastName}
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
                {supplier?.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Middle Name">
                {' '}
                {supplier?.middleName ? supplier?.middleName : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {' '}
                {supplier?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email address">
                {supplier?.email ? supplier?.email : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {' '}
                {supplier?.phoneNo ? supplier?.phoneNo : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Unique ID">
                {' '}
                {supplier?.uniqueId ? supplier?.uniqueId : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="NID">
                {' '}
                {supplier?.nid ? supplier?.nid : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {' '}
                {supplier?.gender ? supplier?.gender : 'N/A'}
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
                {supplier?.presentAddress ? supplier?.presentAddress : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent address">
                {' '}
                {supplier?.permanentAddress
                  ? supplier?.permanentAddress
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
      </Card>
      <SupplierActions supplier={supplier} />
    </>
  )
}

export default SupplierUI
