import { Table, TableColumnsType } from 'antd'

interface VariantType {
  colors: string
  imeiNumbers: string
  rams: string
  roms: string
  sellingPrices: number
  totalPrices: number
}

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

const SellTable = ({ payloads }: any) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'P. NAME',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'VARIANT',
      dataIndex: 'variantDetails',
      key: 'variantDetails',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: 'QTY',
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
      render: (text: number | undefined) => `${text || 0} %`,
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
      render: (text: number | undefined) => `${text || 0} %`,
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
    total: payload.totalPrice,
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

  const paid = 0 // example paid amount
  const due = totalNet - paid

  return (
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
              <Table.Summary.Cell index={2}>
                {data.length} Item
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
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={7}>
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {totalNet.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={7}>
                Discount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {totalDiscountAmount.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={7}>
                Net Total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {totalNet.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={7}>
                Pay
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {paid.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={7}>
                Due
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {due.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </div>
  )
}

export default SellTable
