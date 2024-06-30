import { useGetSinglePurchaseGroupQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { ISupplier, IVariant } from '@/types'
import { Col, Row, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { flexCenter } from '../styles/style'

const { Title, Text } = Typography

interface SupplierInvoiceProps {
  id: string
  supplier: ISupplier
}

const SupplierInvoice: React.FC<SupplierInvoiceProps> = ({ id, supplier }) => {
  const { data, isLoading } = useGetSinglePurchaseGroupQuery(id)

  if (isLoading) {
    return <Spin size="small" />
  }

  const columns = [
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
      title: 'P. PRICE',
      dataIndex: 'purchaseRate',
      key: 'purchaseRate',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'DISCOUNT (%)',
      dataIndex: 'discounts',
      key: 'discounts',
    },
    {
      title: 'DISCOUNT A.',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
    },
    {
      title: 'VAT (%)',
      dataIndex: 'vats',
      key: 'vats',
    },
    {
      title: 'V. AMOUNT',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
  ]

  const payInSupplier = [
    {
      title: 'Payment date',
      dataIndex: 'createdAt',
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY, hh:mm A')
      },
    },
    {
      title: 'Total pay',
      dataIndex: 'payAmount',
      key: 'payAmount',
    },
  ]

  const payInSupplierDataSource = data?.payInSupplier

  const groupedProducts = data?.supplierSellProducts?.reduce(
    (acc: Record<string, any>, product: any) => {
      product.variants.forEach((variant: IVariant) => {
        const key = `${product.productName}`
        if (!acc[key]) {
          acc[key] = {
            key,
            productName: key,
            quantity: 0,
            purchaseRate: product.purchase.purchaseRate,
            totalAmount: 0,
            discounts: product.purchase.discounts,
            discountAmount: 0,
            vats: product.purchase.vats,
            vatAmount: 0,
            totalPrice: 0,
            variants: [],
          }
        }
        const quantity = product.purchase.productStock ?? 0
        const totalAmount = (product.purchase.purchaseRate * quantity).toFixed(
          2
        )
        const discountAmount = (
          (product.purchase.discounts / 100) *
          parseFloat(totalAmount)
        ).toFixed(2)
        const vatAmount = (
          (product.purchase.vats / 100) *
          (parseFloat(totalAmount) - parseFloat(discountAmount))
        ).toFixed(2)
        acc[key].quantity = quantity
        acc[key].totalAmount = parseFloat(totalAmount)
        acc[key].discountAmount = parseFloat(discountAmount)
        acc[key].vatAmount = parseFloat(vatAmount)
        acc[key].totalPrice = (
          parseFloat(totalAmount) -
          parseFloat(discountAmount) +
          parseFloat(vatAmount)
        ).toFixed(2)
        acc[key].variants.push(
          `${variant.ram}GB / ${variant.rom}GB / ${variant.color} [${variant.imeiNumber}]`
        )
      })
      return acc
    },
    {}
  )

  const dataSource = Object?.values(groupedProducts)?.map(product => ({
    // @ts-ignore
    ...product,
    // @ts-ignore
    variants: product.variants.join(', '),
  }))

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
            <Text>Invoice No: {data?.uniqueId}</Text>
            <br />
            <Text>
              Invoice Date:{' '}
              {dayjs(data.createdAt).format('D MMM, YYYY, hh:mm A')}
            </Text>
            <br />
            {/* <Text>Due Pay Date: </Text> */}
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
          let totalQuantity = 0
          let totalDiscountAmount = 0
          let totalVatAmount = 0
          let totalPrice = 0

          pageData.forEach(
            ({
              totalAmount: amount,
              quantity,
              discountAmount,
              vatAmount,
              totalPrice: price,
            }) => {
              totalAmount += amount
              totalQuantity += quantity
              totalDiscountAmount += discountAmount
              totalVatAmount += vatAmount
              totalPrice += parseFloat(price)
            }
          )

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2}>
                  <Text>{totalQuantity} items</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4}>
                  <Text>{totalAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6}>
                  <Text>{totalDiscountAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
                <Table.Summary.Cell index={8}>
                  <Text>{totalVatAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <Text>{totalPrice.toFixed(2)}</Text>
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
        {!data?.payInSupplier.length ? (
          <Col span={16} style={flexCenter}>
            <Text strong>Additional payments not available</Text>
          </Col>
        ) : (
          <Col span={16}>
            <Text strong>Additional payments</Text>
            <Table
              columns={payInSupplier}
              dataSource={payInSupplierDataSource}
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
              <Text>{data?.supplierSells?.totalSellAmounts?.toFixed(2)}</Text>
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
                {dataSource
                  .reduce(
                    (acc, item) => acc + parseFloat(item.discountAmount),
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
              <Text>Total VAT:</Text> {/* Added VAT amount */}
              <Text>
                {dataSource
                  .reduce((acc, item) => acc + parseFloat(item.vatAmount), 0)
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
                {(
                  data?.supplierSells?.totalSellAmounts -
                  dataSource.reduce(
                    (acc, item) => acc + parseFloat(item.discountAmount),
                    0
                  ) +
                  dataSource.reduce(
                    (acc, item) => acc + parseFloat(item.vatAmount),
                    0
                  )
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
              <Text>{data?.supplierSells?.totalPay?.toFixed(2)}</Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Due:</Text>
              <Text>{data?.supplierSells?.totalDue?.toFixed(2)}</Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SupplierInvoice
