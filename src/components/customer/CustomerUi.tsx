import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Descriptions, Divider, Row, Typography } from 'antd'

const { Title, Text } = Typography

const CustomerUi = ({ customer }: any) => {
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
                customer?.profileImage
                  ? `http://localhost:7000${customer?.profileImage}`
                  : 'https://via.placeholder.com/300'
              }
              style={{ marginBottom: 16 }}
            />
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Col>
            <Title level={4}>
              {customer?.firstName}{' '}
              {customer?.middleName === null ? '' : customer?.middleName}{' '}
              {customer?.lastName}
            </Title>
            <Text type="secondary">customer Information</Text>
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
                {customer?.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Middle Name">
                {' '}
                {customer?.middleName ? customer?.middleName : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {' '}
                {customer?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email address">
                {customer?.email ? customer?.email : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {' '}
                {customer?.phoneNo ? customer?.phoneNo : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Unique ID">
                {' '}
                {customer?.uniqueId ? customer?.uniqueId : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="NID">
                {' '}
                {customer?.nid ? customer?.nid : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {' '}
                {customer?.gender ? customer?.gender : 'N/A'}
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
                {customer?.presentAddress ? customer?.presentAddress : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent address">
                {' '}
                {customer?.permanentAddress
                  ? customer?.permanentAddress
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
      </Card>
    </>
  )
}

export default CustomerUi
