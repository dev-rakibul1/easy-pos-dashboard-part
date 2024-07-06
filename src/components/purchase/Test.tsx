import { currencyName } from '@/constants/global'
import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import React from 'react'

interface DataType {
  key: React.Key
  productName: string
  productStock: number
  discounts: number
  vats: number
  purchaseRate: number
  totalPrice: number
  productId: string
}

interface ExpandedDataType {
  key: React.Key
  imeiNumber: string
  ram: string
  rom: string
  color: string
  productId: string
}

interface PayloadsType {
  purchase: DataType[]
  variants: ExpandedDataType[]
}

interface TestTableProps {
  payloads: PayloadsType
}

const TestTable: React.FC<TestTableProps> = ({ payloads }) => {
  const expandedRowRender = (record: DataType) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: 'IMEI Number', dataIndex: 'imeiNumber', key: 'imeiNumber' },
      { title: 'RAM', dataIndex: 'ram', key: 'ram' },
      { title: 'ROM', dataIndex: 'rom', key: 'rom' },
      { title: 'Color', dataIndex: 'color', key: 'color' },
    ]

    const variantsData = payloads.variants
      .filter(variant => variant.productId === record.productId)
      .map((item, index) => ({ ...item, key: index.toString() }))

    return (
      <Table
        columns={columns}
        dataSource={variantsData}
        pagination={false}
        bordered
      />
    )
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Product Count',
      dataIndex: 'productStock',
      key: 'productStock',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'Discounts',
      dataIndex: 'discounts',
      key: 'discounts',
      render: (text: number | undefined) => `${text}` || '-',
    },
    {
      title: 'VATs',
      dataIndex: 'vats',
      key: 'vats',
      render: (text: number | undefined) => `${text}` || '-',
    },
    {
      title: 'Purchase Rate',
      dataIndex: 'purchaseRate',
      key: 'purchaseRate',
      render: (text: number | undefined) => `${currencyName} ${text}` || '-',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: number | undefined) => `${currencyName} ${text}` || '-',
    },
  ]

  const data = payloads?.purchase?.map((item, index) => ({
    ...item,
    key: index.toString(),
  }))

  const totalProductCount = payloads.purchase.reduce(
    (acc, item) => acc + item.productStock,
    0
  )
  const totalDiscounts = payloads.purchase.reduce(
    (acc, item) => acc + item.discounts,
    0
  )
  const totalVATs = payloads.purchase.reduce((acc, item) => acc + item.vats, 0)
  const totalPurchaseRate = payloads.purchase.reduce(
    (acc, item) => acc + item.purchaseRate,
    0
  )
  const totalPrice = payloads.purchase.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  )

  return (
    <Table
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={data}
      size="small"
      bordered
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
          <Table.Summary.Cell index={1}></Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{totalProductCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{totalDiscounts}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{totalVATs}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            {currencyName} {totalPurchaseRate}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            {currencyName} {totalPrice}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  )
}

export default TestTable
