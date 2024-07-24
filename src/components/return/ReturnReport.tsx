import { currencyName } from '@/constants/global'
import { useGetSingleReturnGroupQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { ISupplier, IVariant } from '@/types'
import { Col, Row, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { flexCenter } from '../styles/style'

const { Title, Text } = Typography

interface ReturnInvoiceProps {
  id: string
  supplier: ISupplier
  componentRef: any
}

const ReturnInvoice: React.FC<ReturnInvoiceProps> = ({
  id,
  supplier,
  componentRef,
}) => {
  const { data, isLoading } = useGetSingleReturnGroupQuery(id)

  if (isLoading) {
    return <Spin size="small" />
  }

  if (!data) {
    return <Text>No data available</Text>
  }

  const additionalPayment = [
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
      render: (payAmount: number) => {
        return (
          <span>
            {currencyName} {payAmount}
          </span>
        )
      },
    },
  ]

  const additionalPaymentDataSource = data?.additionalMoneyBack

  const columns = [
    {
      title: 'CUSTOMER',
      dataIndex: 'customer',
      key: 'customer',
      render: () => data.supplierReturnPayments.user.firstName,
    },
    {
      title: 'PRODUCT',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'VARIANTS',
      dataIndex: 'variants',
      key: 'variants',
      width: '25%',
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice: number) => {
        return (
          <span>
            {currencyName} {totalPrice}
          </span>
        )
      },
    },
  ]

  const groupedProducts = data.userReturnProducts.reduce(
    (acc: Record<string, any>, product: any) => {
      product.returns.forEach((variant: IVariant) => {
        const key = `${product.productName}`
        if (!acc[key]) {
          acc[key] = {
            key,
            productName: key,
            quantity: 0,
            purchaseRate: 6, // Assuming a fixed purchase rate
            totalAmount: 0,
            discounts: 0, // Assuming no discount
            discountAmount: 0,
            vats: 0, // Assuming no VAT
            vatAmount: 0,
            totalPrice: 0,
            variants: [],
          }
        }
        const quantity = 1 // Assuming each variant adds a quantity of 1

        acc[key].quantity += quantity
        acc[key].totalPrice += variant?.price // Add the variant price to totalPrice
        acc[key].variants.push(
          `${variant.ram}GB / ${variant.rom}GB / ${variant.color} [${variant.imeiNumber}]`
        )
      })
      return acc
    },
    {}
  )

  const dataSource = Object.values(groupedProducts).map((product: any) => ({
    ...product,
    variants: product.variants.join(', '),
  }))

  return (
    <div
      ref={componentRef}
      style={{ padding: '15px', border: '1px solid #ddd' }}
    >
      <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Title level={4} style={{ margin: '0', padding: '0' }}>
            Track For Creativity LLC
          </Title>
          <Text>Email: admin@gmail.com</Text>
          <br />
          <Text>Phone: +96894803010</Text>
          <br />
          <Text>Address: sur souq sultanate of oman</Text>
        </Col>
      </Row>
      <div style={{ marginTop: '15px', padding: '0 10px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={4}>TAX INVOICE</Title>
        </Col>
        <Row gutter={[16, 16]} style={{ border: '1px solid #ddd' }}>
          <Col span={12}>
            <Text strong>Supplier Info</Text>
            <br />
            <Text>Name: {supplier?.firstName}</Text>
            <br />
            <Text>Phone: {supplier?.phoneNo}</Text>
            <br />
            <Text>Email: {supplier?.email}</Text>
            <br />
            <Text>Address: {supplier?.presentAddress}</Text>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #ddd' }}>
            <Text strong>Invoice Info</Text>
            <br />
            <Text>Invoice No: {data.uniqueId}</Text>
            <br />
            <Text>
              Invoice Date:{' '}
              {dayjs(data.createdAt).format('D MMM, YYYY, hh:mm A')}
            </Text>
          </Col>
        </Row>
      </div>
      <Table
        loading={isLoading}
        style={{ marginTop: '15px' }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        summary={pageData => {
          let totalQuantity = 0
          let totalPrice = 0

          pageData.forEach(({ quantity, totalPrice: price }) => {
            totalQuantity += quantity
            totalPrice += price
          })

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3}>
                  <Text>{totalQuantity} items</Text>
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
          justifyContent: 'flex-end', // Align items to the end of the row
        }}
      >
        {!data.additionalMoneyBack?.length ? (
          <Col span={16} style={flexCenter}>
            <Text strong>Additional payments not available</Text>
          </Col>
        ) : (
          <Col span={16}>
            <Text strong>Additional payments</Text>

            <Table
              columns={additionalPayment}
              dataSource={additionalPaymentDataSource}
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
                {data.supplierReturnPayments.totalReturnAmount.toFixed(2)}
              </Text>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Total Paid:</Text>
              <Text>
                {currencyName} {data.supplierReturnPayments.totalPay.toFixed(2)}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Total Due:</Text>
              <Text>
                {currencyName} {data.supplierReturnPayments.totalDue.toFixed(2)}
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ReturnInvoice
