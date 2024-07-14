'use client'

import { currencyName } from '@/constants/global'
import { useGetSellGroupByCurrentMonthQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { ISupplier } from '@/types'
import { Col, Row, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title, Text } = Typography

interface SupplierInvoiceProps {
  id: string
  supplier: ISupplier
}

interface GroupedData {
  sellingDate: string
  totalSells: number
  vats: number
  vatAmounts: number
  totalPrice: number
}

const MonthlyVatReports: React.FC<SupplierInvoiceProps> = ({
  id,
  supplier,
}) => {
  const { data: sellGroups, isLoading } = useGetSellGroupByCurrentMonthQuery({
    limit: 1200,
  })
  const data = sellGroups?.sellGroups

  if (isLoading) {
    return <Spin size="small" />
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD')
  }

  const currentMonth = dayjs().month()
  const currentYear = dayjs().year()
  const daysInMonth = dayjs().daysInMonth()
  const allDatesInMonth = Array.from({ length: daysInMonth }, (_, i) =>
    dayjs(new Date(currentYear, currentMonth, i + 1)).format('YYYY-MM-DD')
  )

  const groupedData: { [key: string]: GroupedData } =
    data?.reduce((acc, transaction) => {
      const date = formatDate(transaction.createdAt)
      if (!acc[date]) {
        acc[date] = {
          sellingDate: date,
          totalSells: 0,
          vats: 0,
          vatAmounts: 0,
          totalPrice: 0,
        }
      }
      acc[date].totalSells +=
        transaction.customerPurchase?.totalPurchaseAmounts ?? 0
      acc[date].vats +=
        transaction.customerPurchaseProducts?.reduce(
          (acc, product) => acc + (product.sell?.vats ?? 0),
          0
        ) ?? 0
      acc[date].vatAmounts +=
        transaction.customerPurchaseProducts?.reduce(
          (acc, product) =>
            acc +
            ((product.sell?.vats ?? 0) * (product.sell?.sellingPrice ?? 0)) /
              100,
          0
        ) ?? 0
      acc[date].totalPrice +=
        transaction.customerPurchase?.totalPurchaseAmounts ?? 0
      return acc
    }, {}) ?? {}

  allDatesInMonth.forEach(date => {
    if (!groupedData[date]) {
      groupedData[date] = {
        sellingDate: date,
        totalSells: 0,
        vats: 0,
        vatAmounts: 0,
        totalPrice: 0,
      }
    }
  })

  const dataSource = Object.values(groupedData)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'sellingDate',
      key: 'sellingDate',
    },
    {
      title: 'Total sells',
      dataIndex: 'totalSells',
      key: 'totalSells',
    },
    {
      title: 'Vats (%)',
      dataIndex: 'vats',
      key: 'vats',
    },
    {
      title: 'Vats amount',
      dataIndex: 'vatAmounts',
      key: 'vatAmounts',
      render: (amount: number) => {
        return (
          <span>
            {currencyName} {amount.toFixed(2)}
          </span>
        )
      },
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (amount: number) => {
        return (
          <span>
            {currencyName} {amount.toFixed(2)}
          </span>
        )
      },
    },
  ]

  const today = new Date() // Getting full month name (e.g. "September")
  const month = today.toLocaleString('default', { month: 'long' })
  const year = today.getFullYear()
  const fullMonth = `${month}, ${year}`

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd' }}>
      <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Title level={4} style={{ margin: '0', padding: '0' }}>
            Track For Creativity LLC
          </Title>
          <Text>Email: admin@gmail.com</Text>
          <br />
          <Text>Phone: +96894803010</Text>
          <br />
          <Text>Address: Sur Souq, Sultanate of Oman</Text>
        </Col>
      </Row>
      <div style={{ marginTop: '15px', padding: '0 10px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={4}>TAX INVOICE</Title>
        </Col>
        <Row gutter={[16, 16]} style={{ border: '1px solid #ddd' }}>
          <Col span={12}>
            <Text strong>Tax company</Text>
            <br />
            <Text>Company name: Track For Creativity LLC</Text>
            <br />
            <Text>Phone: +96894803010</Text>
            <br />
            <Text>Email: admin@gmail.com</Text>
            <br />
            <Text>Address: Sur Souq, Sultanate of Oman</Text>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #ddd' }}>
            <Text strong>Receive tax</Text>
            <br />
            <Text>Invoice type: Govt tax invoice</Text>
            <br />
            <Text>Tax month: {`${fullMonth}`}</Text>
            <br />
          </Col>
        </Row>
      </div>
      <Table
        style={{ marginTop: '15px' }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        summary={pageData => {
          let totalAmount = 0
          let totalVatAmount = 0
          let totalPrice = 0

          pageData.forEach(({ totalSells, vatAmounts, totalPrice: price }) => {
            totalAmount += totalSells
            totalVatAmount += vatAmounts
            totalPrice += price
          })

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>
                    {currencyName} {totalAmount.toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3}>
                  <Text>
                    {currencyName} {totalVatAmount.toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>
                    {currencyName} {totalPrice.toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
      />

      <Row
        gutter={[16, 16]}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Col
          span={8}
          style={{ marginTop: '25px', background: '#fff', padding: '10px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Total Net:</Text>
              <Text>
                {currencyName}{' '}
                {data
                  ?.reduce(
                    (acc, item) =>
                      acc + (item.customerPurchase?.totalPurchaseAmounts ?? 0),
                    0
                  )
                  .toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Total VAT:</Text>
              <Text>
                {currencyName}
                {dataSource
                  ?.reduce((acc, item) => acc + item.vatAmounts, 0)
                  .toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Net Total:</Text>
              <Text>
                {currencyName}
                {(
                  data?.reduce(
                    (acc, item) =>
                      acc + (item.customerPurchase?.totalPurchaseAmounts ?? 0),
                    0
                  ) +
                  dataSource?.reduce((acc, item) => acc + item.vatAmounts, 0)
                ).toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Pay:</Text>
              <Text>
                {currencyName}{' '}
                {data
                  ?.reduce(
                    (acc, item) => acc + (item.customerPurchase?.totalPay ?? 0),
                    0
                  )
                  .toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Due:</Text>
              <Text>
                {currencyName}{' '}
                {data
                  ?.reduce(
                    (acc, item) => acc + (item.customerPurchase?.totalDue ?? 0),
                    0
                  )
                  .toFixed(2)}
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MonthlyVatReports
