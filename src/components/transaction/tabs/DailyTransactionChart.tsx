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
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
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
  const dataSource = sellsToday?.map((sell: SellData, index: number) => ({
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

  // Ensure purchaseInfo is defined and is an array
  const purchaseInfo = purchases?.purchases || []
  const returnsInfo = returns?.returns || []
  const salesData = sales || []

  const purchaseData = purchaseInfo.map((pur: any, i: number) => ({
    category: `TXN ${i + 1}`,
    value: pur?.totalPrice,
  }))

  const returnData = returnsInfo.map((ret: any, i: number) => ({
    category: `TXN ${i + 1}`,
    value: ret?.price,
  }))

  const salesChartData = salesData.map((sale: any, i: number) => ({
    category: `TXN ${i + 1}`,
    value: sale?.totalSellPrice,
  }))

  const series = [
    {
      name: 'Purchases',
      data: purchaseData,
      color: 'RoyalBlue',
    },
    {
      name: 'Return',
      data: returnData,
      color: 'Magenta',
    },
    {
      name: 'Sales',
      data: salesChartData,
      color: 'Lime',
    },
  ]

  // const series = [
  //   {
  //     name: 'Series 1',
  //     data: [
  //       { category: 'A', value: Math.random() },
  //       { category: 'B', value: Math.random() },
  //       { category: 'C', value: Math.random() },
  //     ],
  //   },
  //   {
  //     name: 'Series 2',
  //     data: [
  //       { category: 'B', value: Math.random() },
  //       { category: 'C', value: Math.random() },
  //       { category: 'D', value: Math.random() },
  //       { category: 'E', value: Math.random() },
  //       { category: 'F', value: Math.random() },
  //       { category: 'G', value: Math.random() },
  //     ],
  //   },
  //   {
  //     name: 'Series 3',
  //     data: [
  //       { category: 'C', value: Math.random() },
  //       { category: 'D', value: Math.random() },
  //       { category: 'E', value: Math.random() },
  //     ],
  //   },
  // ]

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card title="Spending Statistic">
            {/* <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  type="number"
                  tick={<CustomizedAxisTick />}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map(s => (
                  <Line
                    key={s.name}
                    dataKey="value"
                    data={s.data}
                    name={s.name}
                    // stroke={s.color}
                    // label={<CustomizedLabel />}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis />
                <Tooltip />
                <Legend />

                {series.map(s => (
                  <Line
                    // type="monotone"
                    dataKey="value"
                    data={s.data}
                    name={s.name}
                    key={s.name}
                    stroke={s.color}
                    label={<CustomizedLabel />}
                  />
                ))}
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
