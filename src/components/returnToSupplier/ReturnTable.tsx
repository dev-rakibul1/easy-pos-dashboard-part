import { Table, TableColumnsType } from 'antd'
import { useState } from 'react'
// @ts-ignore
import { currencyName } from '@/constants/global'
import ReturnAmounts from './ReturnAmount'

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

const ReturnTable = ({ payloads, setSellPayloads }: any) => {
  const [payAmountInfo, setPayAmountInfo] = useState({
    amount: 0,
    paymentMethod: '',
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: 'SUPPLIER NAME',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
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
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      render: (text: number | undefined) => `${currencyName} ${text}` || '-',
    },
  ]

  const data = payloads.map((payload: any, index: number) => ({
    key: index,
    supplierName: payload.supplierName,
    productName: payload.productName,
    variantDetails: payload.variants
      .map(
        (variant: any) =>
          `${variant.ram} GB / ${variant.rom} GB / ${variant.color} [${variant.imeiNumber}]`
      )
      .join(', '),
    quantity: payload.quantity,
    total: payload.totalPrice * payload.quantity,
  }))

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

  return (
    <>
      {payloads?.length > 0 && (
        <div>
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
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3}>
                    {quantities} Items
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    {currencyName} {totalNet.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} />
                  <Table.Summary.Cell index={1} colSpan={3} align="right">
                    Net Total
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {currencyName} {totalNet.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} />
                  <Table.Summary.Cell index={1} colSpan={3} align="right">
                    Pay
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {currencyName} {paid.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} />
                  <Table.Summary.Cell index={1} colSpan={3} align="right">
                    Due
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {currencyName} {due.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )}
          />

          {/* Sell pay */}
          <ReturnAmounts
            setPayAmountInfo={setPayAmountInfo}
            dueBalance={totalNet}
            returnPayloads={payloads}
            setReturnPayloads={setSellPayloads}
          />
        </div>
      )}
    </>
  )
}

export default ReturnTable
