import { Table, TableColumnsType } from 'antd'
import { useRef, useState } from 'react'
// @ts-ignore
import ReportTitle from '../companyReportTitle/ReportTitle'
import SellPay, { ISellPayISellPay } from './SellPay'

interface DataType {
  key: React.Key
  productName: string
  variantDetails: string
  quantity: number
  purchasePrice: number
  amount: number
  discount: number
  discountAmount: number
  vat: number
  vatAmount: number
  total: number
}

const SellTable = ({
  payloads,
  setSellPayloads,
  singleCustomerById,
  setSelectCustomer,
}: any) => {
  const [payAmountInfo, setPayAmountInfo] = useState<ISellPayISellPay>({
    amount: 0,
    paymentMethod: '',
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: 'PRODUCT',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'VARIANT',
      dataIndex: 'variantDetails',
      key: 'variantDetails',
      render: (text: string) => <div>{text}</div>,
      width: '20%',
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'P. PRICE',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'DISCOUNT (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (text: number | undefined) => `${text || 0}%`,
    },
    {
      title: 'DISCOUNT A.',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'VAT (%)',
      dataIndex: 'vat',
      key: 'vat',
      render: (text: number | undefined) => `${text || 0}%`,
    },
    {
      title: 'VAT A.',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      render: (text: number | undefined) => text || '-',
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      render: (text: number | undefined) => text || '-',
    },
  ]

  const data = payloads.map((payload: any, index: number) => ({
    key: index,
    productName: payload.productName,
    variantDetails: payload.variants
      .map(
        (variant: any) =>
          `${variant.ram} GB / ${variant.rom} GB / ${variant.color} [${variant.imeiNumber}]`
      )
      .join(', '),
    quantity: payload.quantity,
    purchasePrice: payload.sellingPrice,
    amount: payload.sellingPrice * payload.quantity,
    discount: payload.discounts,
    discountAmount:
      (payload.sellingPrice * payload.quantity * payload.discounts) / 100,
    vat: payload.vats,
    vatAmount: (payload.sellingPrice * payload.quantity * payload.vats) / 100,
    total: payload.totalPrice * payload.quantity,
  }))

  const totalAmount = data.reduce(
    (acc: number, item: DataType) => acc + item.amount,
    0
  )
  const totalDiscountAmount = data.reduce(
    (acc: number, item: DataType) => acc + item.discountAmount,
    0
  )
  const totalVatAmount = data.reduce(
    (acc: number, item: DataType) => acc + item.vatAmount,
    0
  )
  const totalNet = data.reduce(
    (acc: number, item: DataType) => acc + item.total,
    0
  )
  const quantities = data.reduce(
    (acc: number, item: DataType) => acc + item.quantity,
    0
  )

  // Calculate paid and due
  const paid = Number(payAmountInfo.amount) || 0
  const due = totalNet - paid

  // Print
  const componentRef = useRef()

  return (
    <>
      {payloads?.length && (
        <div>
          {/* @ts-ignore */}
          <div ref={componentRef}>
            {
              <ReportTitle
                buyer={singleCustomerById}
                title="Customer information"
                invoiceType="Sales invoice"
              />
            }
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
                      {totalAmount.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      {totalDiscountAmount.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      {totalVatAmount.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                      {totalNet.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ textAlign: 'right' }}>
                    <Table.Summary.Cell index={0} colSpan={8}>
                      Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalNet.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ textAlign: 'right' }}>
                    <Table.Summary.Cell index={0} colSpan={8}>
                      Discount
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalDiscountAmount.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ textAlign: 'right' }}>
                    <Table.Summary.Cell index={0} colSpan={8}>
                      Net Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {totalNet.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ textAlign: 'right' }}>
                    <Table.Summary.Cell index={0} colSpan={8}>
                      Pay
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {paid.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ textAlign: 'right' }}>
                    <Table.Summary.Cell index={0} colSpan={8}>
                      Due
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      {due.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )}
            />
          </div>

          {/* Sell pay */}
          <SellPay
            setPayAmountInfo={setPayAmountInfo}
            dueBalance={totalNet}
            sellPayloads={payloads}
            setSellPayloads={setSellPayloads}
            componentRef={componentRef}
            setSelectCustomer={setSelectCustomer}
          />
        </div>
      )}
    </>
  )
}

export default SellTable
