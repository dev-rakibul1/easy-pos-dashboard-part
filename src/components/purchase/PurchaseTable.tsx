import { Table } from 'antd'
import { useMemo } from 'react'
import { IFormValues } from './Purchase'

interface PurchaseItem {
  key: string
  productName?: string
  discounts?: string
  vats?: string
  purchaseRate?: string
  sellingPrice?: string
  totalPrice?: string
  ram?: string
  room?: string
  color?: string
}

const PurchaseTable = ({
  payloads,
  formValues,
}: {
  payloads: { purchase: PurchaseItem[] }
  formValues: IFormValues
}) => {
  const purchase = payloads.purchase
  console.log(payloads)

  const dataSourceWithTotals = useMemo(() => {
    if (!purchase) return []

    const totalVats = purchase
      .reduce((acc, item) => acc + (parseInt(item.vats || '0') || 0), 0)
      .toFixed(2)
    const totalDiscounts = purchase
      .reduce((acc, item) => acc + (parseInt(item.discounts || '0') || 0), 0)
      .toFixed(2)
    const totalPrices = purchase
      .reduce((acc, item) => acc + (parseInt(item.totalPrice || '0') || 0), 0)
      .toFixed(2)
    const purchasePrice = purchase
      .reduce((acc, item) => acc + (parseInt(item.purchaseRate || '0') || 0), 0)
      .toFixed(2)
    const sellingPrice = purchase
      .reduce((acc, item) => acc + (parseInt(item.sellingPrice || '0') || 0), 0)
      .toFixed(2)

    return [
      ...purchase,
      {
        key: 'totals',
        discounts: totalDiscounts,
        vats: totalVats,
        purchaseRate: purchasePrice,
        // @ts-ignore
        totalPrice: parseFloat(totalPrices - formValues?.amount).toFixed(2),
        sellingPrice: sellingPrice,
      },
    ]
  }, [formValues, purchase])

  const columns = [
    {
      title: 'P. Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'P. Count',
      dataIndex: 'productStock',
      key: 'productStock',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'O. Count',
      dataIndex: 'othersStock',
      key: 'othersStock',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Discounts',
      dataIndex: 'discounts',
      key: 'discounts',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Vats',
      dataIndex: 'vats',
      key: 'vats',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Pur. Rate',
      dataIndex: 'purchaseRate',
      key: 'purchaseRate',
      render: (text: string | undefined) => text || '-',
    },
    // {
    //   title: 'S. Price',
    //   dataIndex: 'sellingPrice',
    //   key: 'sellingPrice',
    //   render: (text: string | undefined) => text || '-',
    // },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Ram',
      dataIndex: 'ram',
      key: 'ram',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (text: string | undefined) => text || '-',
    },
  ]

  const handlePurchaseProduct = () => {
    console.log(formValues)
    console.log(payloads)
  }

  return (
    <div>
      <Table
        dataSource={dataSourceWithTotals}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  )
}

export default PurchaseTable
