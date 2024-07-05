'use client'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, List, Row, Statistic, Table, Tag } from 'antd'
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

const data = [
  { name: 'Sat', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Sun', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mon', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Tue', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Wed', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Thu', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Fri', uv: 3490, pv: 4300, amt: 2100 },
]

const columns = [
  { title: 'NO', dataIndex: 'no', key: 'no' },
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: any) => (
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

const dataSource = [
  {
    key: '1',
    no: '01',
    id: '#123456',
    date: 'Nov 20th,22',
    price: '$320.00',
    status: 'New order',
  },
  {
    key: '2',
    no: '02',
    id: '#234567',
    date: 'Nov 19th,22',
    price: '$920.00',
    status: 'On Delivery',
  },
  {
    key: '3',
    no: '03',
    id: '#345678',
    date: 'Nov 25th,22',
    price: '$520.00',
    status: 'Not Available',
  },
]

function WeeklyTransaction() {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={11354}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Customer" value={45439} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Profit"
              value={8354}
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
                data={data}
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
          <Card title="Lastest order">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Sales">
            <List
              itemLayout="horizontal"
              dataSource={[
                { name: 'Robert Fox', time: '01 Minutes Ago', amount: 89 },
                { name: 'Jane Cooper', time: '02 Minutes Ago', amount: 112 },
                { name: 'Dianne Russell', time: '02 Minutes Ago', amount: 54 },
                {
                  name: 'Leslie Alexander',
                  time: '03 Minutes Ago',
                  amount: 21,
                },
                { name: 'Darrell Steward', time: '04 Minutes Ago', amount: 32 },
                { name: 'Jerome Bell', time: '05 Minutes Ago', amount: 65 },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<a href="#">{item.name}</a>}
                    description={item.time}
                  />
                  <div>+${item.amount}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WeeklyTransaction
