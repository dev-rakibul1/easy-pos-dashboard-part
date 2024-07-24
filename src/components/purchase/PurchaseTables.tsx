'use client'

import { IVariant } from '@/types'
import { Table } from 'antd'
import { TransformPurchaseApiResponse } from './purchaseDataConvert'

interface Variant {
  imeiNumber: string
  ram: number
  rom: number
  color: string
  productId: string
}

interface IProduct {
  productName: string
  variants: Variant[]
  othersStock: number
  productStock: number
  purchaseRate: number
  sellingPrice: number
  vats: number
  discounts: number
  totalPrice: number
  productId: string
  supplierId: string
}

type Props = {
  payloads: IProduct[]
}

const PurchaseTables: React.FC<Props> = ({ payloads }) => {
  const convertData = TransformPurchaseApiResponse(payloads)
  const data = convertData?.map((item: any) => ({
    key: item.productId,
    productName: item.productName,
    variants: item.variants,
    qty: item.productStock,
    price: parseFloat(item.purchaseRate?.toFixed(2)),
    total: parseFloat((item.purchaseRate * item.productStock)?.toFixed(2)),
    vat: `${item.vats}%`,
    vatAmount: parseFloat(
      ((item.purchaseRate * item.productStock * item.vats) / 100)?.toFixed(2)
    ),
    discount: `${item.discounts}%`,
    discountAmount: parseFloat(
      ((item.purchaseRate * item.productStock * item.discounts) / 100)?.toFixed(
        2
      )
    ),
    subtotal: parseFloat(item.totalPrice?.toFixed(2)),
  }))

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Variants',
      dataIndex: 'variants',
      key: 'variants',
      render: (variants: IVariant[]) => (
        <>
          {variants?.map(variant => (
            <div key={variant.imeiNumber} style={{ marginBottom: '8px' }}>
              {`[${variant.imeiNumber}] | ${variant.ram}GB | ${variant.rom}GB | ${variant.color}`}
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'VAT',
      dataIndex: 'vat',
      key: 'vat',
    },
    {
      title: 'V. A',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'D. A.',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      rowKey="key"
    />
  )
}

export default PurchaseTables
