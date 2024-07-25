'use client'

import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { IVariant } from '@/types'
import { Table } from 'antd'
import ReportTitle from '../companyReportTitle/ReportTitle'
import { IFormValues } from './Purchase'
import {
  IPurchaseApiResponse,
  TransformPurchaseApiResponse,
} from './purchaseDataConvert'

type Props = {
  payloads: IPurchaseApiResponse
  supplierId: string
  formValues: IFormValues
  componentRef: any
}

const PurchaseTables = ({
  payloads,
  supplierId,
  formValues,
  componentRef,
}: Props) => {
  const convertData = TransformPurchaseApiResponse(payloads)

  // console.log(payloads)
  // console.log(convertData)

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

  const quantities = data.reduce((acc, item) => acc + item.qty, 0).toFixed(2)
  const totalAmount = data.reduce((acc, item) => acc + item.total, 0)
  const totalVatAmount = data.reduce((acc, item) => acc + item.vatAmount, 0)
  const totalDiscountAmount = data.reduce(
    (acc, item) => acc + item.discountAmount,
    0
  )
  // @ts-ignore
  const totalPay = parseFloat(formValues?.amount) || 0

  const totalNet = data.reduce((acc, item) => acc + item.subtotal, 0)
  const paid = totalPay
  const due = totalNet - paid

  // Get supplier
  const { data: supplier } = useGetSingleSupplierQuery(supplierId)

  return (
    <div ref={componentRef}>
      <ReportTitle
        buyer={supplier}
        title="Supplier information"
        invoiceType="Purchase invoice"
      />

      <Table
        columns={columns}
        dataSource={data}
        size="small"
        bordered
        pagination={false}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2}>
                {quantities} Items
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {totalAmount?.toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                {totalVatAmount?.toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
              <Table.Summary.Cell index={8}>
                {totalDiscountAmount?.toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9}>
                {totalNet?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell index={0} colSpan={8}>
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {totalNet?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell index={0} colSpan={8}>
                Discount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {totalDiscountAmount?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell index={0} colSpan={8}>
                Net Total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {totalNet?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell index={0} colSpan={8}>
                Pay
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {paid?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell index={0} colSpan={8}>
                Due
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {due?.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </div>
  )
}

export default PurchaseTables
