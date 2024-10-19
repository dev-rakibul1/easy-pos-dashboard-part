'use client'

import { currencyName } from '@/constants/global'
import { useGetSingleSellGroupQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { ICustomer } from '@/types'
import { Col, Row, Spin, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React from 'react'
import ReportTitle from '../companyReportTitle/ReportTitle'
import { flexCenter } from '../styles/style'

const { Title, Text } = Typography

interface SupplierInvoiceProps {
  id: string
  customer: ICustomer
  componentRef: any
}

interface Variant {
  id: string
  imeiNumber: string
  ram: string
  rom: string
  color: string
}

interface Sell {
  productName: string
  modelName: string
  vats: number
  discounts: number
  sellingPrice: number
  totalSellPrice: number
  quantity: number
}

interface CustomerPurchaseProduct {
  productName: string
  variants: Variant[]
  sell: Sell
}

const CustomerReport: React.FC<SupplierInvoiceProps> = ({
  id,
  customer,
  componentRef,
}) => {
  const { data, isLoading } = useGetSingleSellGroupQuery(id)
  console.log(data)

  if (isLoading) {
    return <Spin size="small" />
  }

  const columns: ColumnsType<CustomerPurchaseProduct> = [
    {
      title: 'PRODUCT',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'VARIANTS',
      dataIndex: 'variants',
      key: 'variants',
      render: (variants: Variant[]) => (
        <span>
          {variants
            .map(
              variant =>
                `${variant.ram}GB / ${variant.rom}GB / ${variant.color} [${variant.imeiNumber}]`
            )
            .join(', ')}
        </span>
      ),
      width: '20%',
    },
    {
      title: 'QUANTITY',
      dataIndex: ['sell', 'quantity'],
      key: 'quantity',
    },
    {
      title: 'PRODUCT P.',
      dataIndex: ['sell', 'sellingPrice'],
      key: 'sellingPrice',
      render: (amount: number) => {
        return (
          <span>
            {currencyName} {amount}
          </span>
        )
      },
    },
    {
      title: 'AMOUNT',
      key: 'amount',
      render: (_, record) => {
        const amount = record.sell.sellingPrice * record.sell.quantity
        return (
          <span>
            {currencyName} {amount.toFixed(2)}
          </span>
        )
      },
    },
    {
      title: 'DISCOUNT (%)',
      dataIndex: ['sell', 'discounts'],
      key: 'discounts',
    },
    {
      title: 'DISCOUNT A.',
      key: 'discountAmount',
      render: (_, record) => {
        const discountAmount =
          record.sell.sellingPrice *
          record.sell.quantity *
          (record.sell.discounts / 100)
        return `${currencyName} ${discountAmount.toFixed(2)}`
      },
    },
    {
      title: 'VAT (%)',
      dataIndex: ['sell', 'vats'],
      key: 'vats',
    },
    {
      title: 'V. AMOUNT',
      key: 'vatAmount',
      render: (_, record) => {
        const vatAmount =
          record.sell.sellingPrice *
          record.sell.quantity *
          (record.sell.vats / 100)
        return `${currencyName} ${vatAmount.toFixed(2)}`
      },
    },
    {
      title: 'TOTAL',
      key: 'total',
      render: (_, record) => {
        const discountAmount =
          record.sell.sellingPrice *
          record.sell.quantity *
          (record.sell.discounts / 100)

        const vatAmount =
          record.sell.sellingPrice *
          record.sell.quantity *
          (record.sell.vats / 100)
        const total =
          record.sell.sellingPrice * record.sell.quantity -
          discountAmount +
          vatAmount
        return `${currencyName} ${total.toFixed(2)}`
      },
    },
  ]

  const customerPayInUser = [
    {
      title: 'Payment date',
      dataIndex: 'createdAt',
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY, hh:mm A')
      },
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: 'Total pay',
      dataIndex: 'payAmount',
      key: 'payAmount',
      render: (amount: number) => {
        return (
          <span>
            {currencyName} {amount}
          </span>
        )
      },
    },
  ]

  const customerPayInUserDataSource = data?.customerPayInUser

  const totalDiscount = data?.customerPurchaseProducts
    .reduce(
      (acc: number, item: any) =>
        acc +
        item.sell.sellingPrice *
          item.sell.quantity *
          (item.sell.discounts / 100),
      0
    )
    .toFixed(2)

  const totalVat = data?.customerPurchaseProducts
    .reduce(
      (acc: number, item: any) =>
        acc +
        item.sell.sellingPrice * item.sell.quantity * (item.sell.vats / 100),
      0
    )
    .toFixed(2)

  const totalAmount = data?.customerPurchaseProducts
    .reduce(
      (acc: number, item: any) =>
        acc + item?.sell?.sellingPrice * item.sell.quantity,
      0
    )
    .toFixed(2)

  const totalQuantity = data?.customerPurchaseProducts
    .reduce((acc: number, item: any) => acc + item.sell.quantity, 0)
    .toFixed(2)

  const totalSum = data?.customerPurchaseProducts
    .reduce((acc: number, item: any) => {
      const discountAmount =
        item.sell.sellingPrice *
        item.sell.quantity *
        (item.sell.discounts / 100)
      const vatAmount =
        item.sell.sellingPrice * item.sell.quantity * (item.sell.vats / 100)
      return (
        acc +
        (item.sell.sellingPrice * item.sell.quantity -
          discountAmount +
          vatAmount)
      )
    }, 0)
    .toFixed(2)

  return (
    <div
      ref={componentRef}
      className="invoice-container"
      style={{ padding: '15px', border: '1px solid #ddd' }}
    >
      <ReportTitle
        buyer={customer}
        title="Customer information"
        invoiceType="Selling invoice"
        invoiceNo={data?.uniqueId}
        invoiceDate={data?.createdAt}
      />

      <div style={{ marginTop: '15x' }}>
        <Table
          columns={columns}
          dataSource={data?.customerPurchaseProducts}
          pagination={false}
          rowKey="id"
          className="invoice-table"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{totalQuantity}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {currencyName} {totalAmount}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                {currencyName} {totalDiscount}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
              <Table.Summary.Cell index={8}>
                {currencyName} {totalVat}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9}>
                {currencyName} {totalSum}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <Row
          gutter={[16, 16]}
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-end', // Align items to the end of the row
          }}
        >
          {!data?.customerPayInUser?.length ? (
            <Col span={16} style={flexCenter}>
              <Text strong>Additional payments not available</Text>
            </Col>
          ) : (
            <Col span={16}>
              <Text strong>Additional payments</Text>
              <Table
                columns={customerPayInUser}
                dataSource={customerPayInUserDataSource}
                pagination={false}
                bordered
              />
            </Col>
          )}
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
                  {data?.customerPurchase?.totalPurchaseAmounts?.toFixed(2)}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>Total Discount:</Text>
                <Text>
                  {currencyName} {totalDiscount}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>VAT Amount:</Text>
                <Text>
                  {currencyName} {totalVat}
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
                  {currencyName}{' '}
                  {(
                    data?.customerPurchase?.totalPurchaseAmounts -
                    parseFloat(totalDiscount) +
                    parseFloat(totalVat)
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
                  {currencyName} {data?.customerPurchase?.totalPay?.toFixed(2)}
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
                  {currencyName} {data?.customerPurchase?.totalDue?.toFixed(2)}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {data?.customerPurchase?.totalPurchaseAmounts <=
        data?.customerPurchase?.totalPay && (
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontSize: '10vw',
            zIndex: '5',
            margin: '0',
            color: '#000',
            opacity: 0.1,
          }}
        >
          Paid
        </h1>
      )}
    </div>
  )
}

export default CustomerReport
