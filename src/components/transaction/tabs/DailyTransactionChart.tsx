'use client'

import { SellData } from '@/app/(dashboardLayout)/super_admin/daily-transaction/page'
import { textCapitalize } from '@/components/styles/style'
import { currencyName } from '@/constants/global'
import { Card, Col, List, Row, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { FC } from 'react'
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

type Props = {
  sales: any
  purchases: any
  returns: any
}

const CustomizedLabel: FC<any> = ({ x, y, stroke, value }) => {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={8} textAnchor="middle">
      {value}
    </text>
  )
}

const CustomizedAxisTick: FC<any> = ({ x, y, stroke, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  )
}

const DailyTransactionChart: FC<Props> = ({ sales, purchases, returns }) => {
  const purchaseInfo = purchases?.purchases

  // Prepare data for recent customers list
  const recentCustomers =
    sales?.map((customer: any) => {
      const customerData = customer.customer
      return {
        ...customerData,
        time: customer.createdAt, // Assuming you want to add 'createdAt' from the 'customer'
      }
    }) || []

  // Calculate total revenue, total customers, and total profit from sells data for the current day
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const sellsToday: SellData[] =
    sales?.filter(
      (sell: SellData) =>
        new Date(sell.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }) === today
    ) || []

  // Table columns and dataSource
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

  // Ensure purchaseInfo is defined and is an array
  const purchaseInformation = purchaseInfo || []
  const returnsInfo = returns?.returns || []

  console.log('sales', sales)

  const data = sales?.map((sale: any, index: number) => {
    const purchase = purchaseInformation[index] || {}
    const returnData = returnsInfo[index] ?? {}

    // Calculate discount amount and format to 2 decimal places
    const discountAmount = (
      sale?.sellingPrice * (sale?.discounts / 100) ?? 0
    ).toFixed(2)

    // Calculate VAT amount and format to 2 decimal places
    const vatAmount = (sale?.sellingPrice * (sale?.vats / 100) ?? 0).toFixed(2)

    return {
      name: `Sale ${String.fromCharCode(65 + index)}`,
      sales: sale?.sellingPrice ?? 0,
      discount: discountAmount,
      vat: vatAmount,
      purchase: purchase?.purchaseRate ?? 0,
      return: returnData?.price ?? 0,
    }
  })

  console.log('data', data)

  const dataSource = sellsToday.map((sell: SellData, index: number) => ({
    key: index.toString(),
    no: index + 1,
    id: sell.uniqueId,
    date: new Date(sell.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    price: `${currencyName} ${sell.totalSellPrice}`,
    status: 'On Delivery', // You can set the actual status here based on your data
  }))

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card title="Spending Statistic">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="green"
                  label={<CustomizedLabel />}
                />
                <Line type="monotone" dataKey="discount" stroke="orange" />
                <Line type="monotone" dataKey="purchase" stroke="blue" />
                <Line type="monotone" dataKey="return" stroke="red" />
                <Line type="monotone" dataKey="vat" stroke="black" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Latest sales" style={{ marginTop: '15px' }}>
            <Table
              dataSource={dataSource || []}
              columns={columns}
              pagination={{ pageSize: 10 }}
              scroll={{ x: '100%' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card title="Customer Growth">
            <div style={{ textAlign: 'center' }}>
              <h3>India</h3>
              <p>45% Customer Loyalty</p>
            </div>
          </Card>

          <Card title="Recent Customers">
            <List
              itemLayout="horizontal"
              dataSource={recentCustomers}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a href="#" style={textCapitalize}>
                        {item?.firstName} {item?.middleName} {item?.lastName}
                      </a>
                    }
                    description={dayjs(item?.time).format(
                      'D MMM, YYYY hh:mm A'
                    )}
                  />
                  <div>{item?.uniqueId}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DailyTransactionChart
