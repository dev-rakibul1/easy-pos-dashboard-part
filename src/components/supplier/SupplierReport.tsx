import { useGetSinglePurchaseGroupQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { ISupplier } from '@/types'
import { Button, Col, Row, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title, Text } = Typography

interface SupplierInvoiceProps {
  id: string
  supplier: ISupplier
}

const SupplierInvoice: React.FC<SupplierInvoiceProps> = ({ id, supplier }) => {
  const { data, isLoading } = useGetSinglePurchaseGroupQuery(id)
  console.log(data)

  if (isLoading) {
    return <Spin size="small" />
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Variants',
      dataIndex: 'variants',
      key: 'variants',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'PUR. Price',
      dataIndex: 'purchaseRate',
      key: 'purchaseRate',
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discounts',
      key: 'discounts',
    },
    {
      title: 'Discount Amount',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
    },
    {
      title: 'VAT (%)',
      dataIndex: 'vats',
      key: 'vats',
    },
    {
      title: 'VAT Amount',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
  ]

  const payInSupplier = [
    {
      title: 'Payment date',
      dataIndex: 'createdAt',
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
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
    (acc: Record<string, any>, product) => {
      product.variants.forEach(variant => {
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
        const totalAmount = product.purchase.purchaseRate * quantity
        const discountAmount = (product.purchase.discounts / 100) * totalAmount
        const vatAmount =
          (product.purchase.vats / 100) * (totalAmount - discountAmount)
        acc[key].quantity = quantity
        acc[key].totalAmount = totalAmount
        acc[key].discountAmount = discountAmount
        acc[key].vatAmount = vatAmount
        acc[key].totalPrice = totalAmount - discountAmount + vatAmount
        acc[key].variants.push(
          `${variant.ram}GB / ${variant.rom}GB / ${variant.color} [${variant.imeiNumber}]`
        )
      })
      return acc
    },
    {}
  )

  const dataSource = Object?.values(groupedProducts)?.map(product => ({
    ...product,
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
            <Text>Invoice No: 11</Text>
            <br />
            <Text>
              Invoice Date: {new Date(data?.createdAt).toLocaleDateString()}
            </Text>
            <br />
            <Text>Due Pay Date: </Text>
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
              totalPrice += price
            }
          )

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Text>{totalQuantity} items</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Text>{totalAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Text>{totalDiscountAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Text>{totalVatAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{totalPrice.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
      />

      <div style={{ marginTop: '15px' }}>
        <Text strong>Additional payments</Text>
        <Table
          columns={payInSupplier}
          dataSource={payInSupplierDataSource}
          pagination={false}
          bordered
        />
      </div>

      <Row
        gutter={[16, 16]}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end', // Align items to the end of the row
        }}
      >
        <Col span={6}>
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
                  .reduce((acc, item) => acc + item.discountAmount, 0)
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
                    (acc, item) => acc + item.discountAmount,
                    0
                  ) +
                  dataSource.reduce((acc, item) => acc + item.vatAmount, 0)
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
            <Button type="primary" onClick={() => window.print()}>
              Print
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SupplierInvoice
