import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Descriptions, Divider, Row, Typography } from 'antd'
import { textCapitalize } from '../styles/style'

const { Title, Text } = Typography

const UserUi = ({ user }: any) => {
  //   console.log('user form user UI pages', user)

  // console.log(user)

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
                user?.profileImage
                  ? `http://localhost:7000${user?.profileImage}`
                  : 'https://via.placeholder.com/300'
              }
              style={{ marginBottom: 16 }}
            />
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Col>
            <Title level={4} style={{ textTransform: 'capitalize' }}>
              {user?.firstName}{' '}
              {user?.middleName === null ? '' : user?.middleName}{' '}
              {user?.lastName}
            </Title>
            <Text type="secondary">User Information</Text>
            <br />
            <Text type="secondary">
              Role:{' '}
              <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </Text>
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
              <Descriptions.Item label="First Name" style={textCapitalize}>
                {' '}
                {user?.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Middle Name" style={textCapitalize}>
                {' '}
                {user?.middleName ? user?.middleName : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name" style={textCapitalize}>
                {' '}
                {user?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email address">
                {user?.email ? user?.email : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {' '}
                {user?.phoneNo ? user?.phoneNo : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Unique ID">
                {' '}
                {user?.uniqueId ? user?.uniqueId : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="NID">
                {' '}
                {user?.nid ? user?.nid : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender" style={textCapitalize}>
                {' '}
                {user?.gender ? user?.gender : 'N/A'}
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
                {user?.presentAddress ? user?.presentAddress : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent address">
                {' '}
                {user?.permanentAddress ? user?.permanentAddress : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
      </Card>
    </>
  )
}

export default UserUi
