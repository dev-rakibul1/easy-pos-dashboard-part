import { useGetFirstShopQuery } from '@/redux/api/shop/shopApi'
import { ICustomer, ISupplier, IUser } from '@/types'
import { Col, Row, Spin, Typography } from 'antd'

const { Title, Text } = Typography

const getCurrentDateTime = (): string => {
  const now = new Date()

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const formattedDate = now.toLocaleString('en-US', options)
  return formattedDate.replace(/, /, ', ')
}

type ReportTitle = {
  buyer: IUser | ICustomer | ISupplier
  title: string
  invoiceType: string
}

const ReportTitle = ({ buyer, title, invoiceType }: ReportTitle) => {
  const { data, isLoading } = useGetFirstShopQuery({ limit: 10 })

  return (
    <div>
      <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
        {isLoading ? (
          <div>
            <Spin size="small" />
          </div>
        ) : (
          <Col span={24}>
            <Title level={4} style={{ margin: '0', padding: '0' }}>
              {data?.shopName || 'N/A'}
            </Title>
            <Text>Email: {data?.email || 'N/A'}</Text>
            <br />
            <Text>Phone: {data?.phone || 'N/A'}</Text>
            <br />
            <Text>Address: {data?.location || 'N/A'}</Text>
          </Col>
        )}
      </Row>
      <div style={{ marginTop: '15px', padding: '0 10px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={4} style={{ textTransform: 'uppercase' }}>
            {invoiceType ? invoiceType : 'N/A'}
          </Title>
        </Col>
        <Row gutter={[16, 16]} style={{ border: '1px solid #ddd' }}>
          <Col span={12}>
            <Text strong>{title ? title : 'N/A'}</Text>
            <br />
            <Text>Name: {buyer?.firstName}</Text>
            <br />
            <Text>Phone: {buyer?.phoneNo}</Text>
            <br />
            <Text>Email: {buyer?.email}</Text>
            <br />
            <Text>Address: {buyer?.presentAddress}</Text>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #ddd' }}>
            <Text strong>Invoice Info</Text>

            <br />
            <Text>Invoice Date: {getCurrentDateTime()}</Text>
            <br />
            {/* <Text>Due Pay Date: </Text> */}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ReportTitle
