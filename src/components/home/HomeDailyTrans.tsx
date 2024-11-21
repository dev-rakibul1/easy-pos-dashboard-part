'use client'
import { ordersData } from '@/constants/global'
import { ShoppingCartOutlined } from '@ant-design/icons'
import {
  Avatar,
  Card,
  Col,
  Layout,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import React from 'react'
import HomeDailyChart from './homeChart/DailyChart'

const { Content } = Layout
const { Title, Text } = Typography

// Table columns configuration
const columns: ColumnsType<any> = [
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (customer: { name: string; image: string }) => (
      <Space>
        <Avatar src={customer.image} shape="circle" size="large" />
        <Text strong>{customer.name}</Text>
      </Space>
    ),
  },
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (orderId: string) => (
      <Text code style={{ fontSize: '14px', color: '#595959' }}>
        {orderId}
      </Text>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag
        color={
          status === 'Pending'
            ? 'orange'
            : status === 'On Hold'
            ? 'red'
            : 'green'
        }
        style={{
          fontSize: '12px',
          padding: '3px 8px',
          borderRadius: '10px',
          fontWeight: '500',
        }}
      >
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Total Items',
    dataIndex: 'totalItems',
    key: 'totalItems',
    render: (totalItems: number) => (
      <Text style={{ fontSize: '12px', color: '#1890ff' }}>
        {totalItems} items
      </Text>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => (
      <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
        ${price.toFixed(2)}
      </Text>
    ),
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render: (date: string) => (
      <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
        {moment(date).format('YYYY-MM-DD HH:mm:ss')}
      </Text>
    ),
  },
]

const HomeDailyTrans: React.FC = () => {
  return (
    <>
      <Layout style={{ padding: '16px', backgroundColor: '#f0f2f5' }}>
        <Content>
          <Row justify="center">
            {/* Recent Orders Section */}
            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <ShoppingCartOutlined
                      style={{ color: '#1890ff', fontSize: '24px' }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      Recent Orders
                    </Title>
                  </Space>
                }
                bordered={false}
                style={{
                  borderRadius: '8px',
                  background: '#fff',
                }}
                bodyStyle={{ padding: '0' }}
              >
                <Table
                  columns={columns}
                  dataSource={ordersData}
                  pagination={false}
                  rowClassName="table-row"
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
      <HomeDailyChart />
    </>
  )
}

export default HomeDailyTrans
