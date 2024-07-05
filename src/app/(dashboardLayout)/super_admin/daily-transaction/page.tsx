'use client'
import { textCapitalize } from '@/components/styles/style'
// Import necessary modules and components
import { useGetSellByCurrentDateQuery } from '@/redux/api/sells/sellsApi'
import { Card, Col, List, Row, Statistic, Table, Tag } from 'antd'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Example type definition for SellData
export interface SellData {
  uniqueId: string
  createdAt: string // Assuming createdAt is a date string
  totalSellPrice: number
  costPrice: number
  customerId: string // Assuming customerId is a string
  // Other properties as per your API response
}

// Define the component function
const DailyTransaction: React.FC = () => {
  // Fetch data using the API query
  const { data, isLoading } = useGetSellByCurrentDateQuery({
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })

  // Calculate total revenue, total customers, and total profit from sells data for the current day
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const sellsToday: SellData[] =
    data?.filter(
      (sell: SellData) =>
        new Date(sell.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }) === today
    ) || []

  const totalRevenue: number = sellsToday.reduce(
    (acc: number, sell: SellData) => acc + sell.totalSellPrice,
    0
  )

  const totalCustomers: number = new Set(
    sellsToday.map((sell: SellData) => sell.customerId)
  ).size

  const totalProfit: number = sellsToday.reduce(
    (acc: number, sell: SellData) =>
      acc + (sell.totalSellPrice - sell.costPrice),
    0
  )

  // Prepare data for the LineChart and Table
  const chartData = sellsToday.map((sell: SellData, index: number) => ({
    name: `${index + 1}`,
    pv: sell.totalSellPrice,
    uv: sell.costPrice,
  }))

  const columns = [
    { title: 'NO', dataIndex: 'no', key: 'no' },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'New order'
              ? 'green'
              : status === 'On Delivery'
              ? 'orange'
              : 'red'
          }
        >
          {status}
        </Tag>
      ),
    },
  ]

  const dataSource = sellsToday.map((sell: SellData, index: number) => ({
    key: index.toString(),
    no: index + 1,
    id: sell.uniqueId,
    date: new Date(sell.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    price: `$${sell.totalSellPrice}`,
    status: 'On Delivery', // You can set the actual status here based on your data
  }))

  // Prepare data for recent customers list
  // const recentCustomers = data?.customer ? [data.customer] : [] // Assuming customer is an object
  // const updateCustomer = data?.map((obj, index) =>{
  //   // const customerObj =
  // })
  const recentCustomers = data?.map((customer: any) => {
    const customerData = customer.customer
    return customerData
  })
  console.log(recentCustomers)

  // Return the JSX for rendering
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Customers" value={totalCustomers} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Profit"
              value={totalProfit}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Spending Statistic">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Customer Growth">
            <div style={{ textAlign: 'center' }}>
              <h3>India</h3>
              <p>45% Customer Loyalty</p>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Latest Orders">
            <Table
              dataSource={dataSource || []}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Customers">
            <List
              itemLayout="horizontal"
              dataSource={recentCustomers}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a href="#" style={textCapitalize}>
                        {item?.firstName && item?.firstName}{' '}
                        {item?.middleName && item?.middleName}{' '}
                        {item?.lastName && item?.lastName}
                      </a>
                    } // Replace with correct field for customer details
                    description={item?.time} // Replace with correct field for customer details
                  />
                  <div>{item?.uniqueId}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// Export the component as default
export default DailyTransaction
