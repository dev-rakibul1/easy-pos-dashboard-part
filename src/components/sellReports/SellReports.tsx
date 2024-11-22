import { Button, Space, Table } from 'antd'
import { parse } from 'json2csv' // For CSV export
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // For PDF table generation

type IProps = {
  salesFilter: any
  loading: boolean
}
const SellReports = ({ salesFilter, loading }: IProps) => {
  const data = salesFilter ? salesFilter?.sellGroups : []

  // Function to calculate total for each product
  const calculateTotal = (product: any) => {
    const sellingPrice = product?.sell?.sellingPrice
    const quantity = product?.sell?.quantity
    const vats = product?.sell?.vats
    const discounts = product?.sell?.discounts

    const vatAmount = (sellingPrice * vats) / 100
    const discountAmount = (sellingPrice * discounts) / 100
    const total = quantity * sellingPrice + vatAmount - discountAmount
    return total.toFixed(2)
  }

  // Function to calculate subtotal
  const calculateSubTotal = (products: any) => {
    const total = products.reduce((acc: number, pro: any) => {
      const productTotal = parseFloat(calculateTotal(pro))
      return acc + productTotal
    }, 0)
    return total.toFixed(2)
  }

  // Table columns
  const columns = [
    {
      title: 'Transaction',
      render: (_: any, __: any, index: number) => (
        <strong>TXN-{index + 1}</strong>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro.productName}</li>
          </ul>
        )),
    },
    {
      title: 'Selling Price',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.sell?.sellingPrice?.toFixed(2)}</li>
          </ul>
        )),
    },
    {
      title: 'Qty',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.sell?.quantity}</li>
          </ul>
        )),
    },
    {
      title: 'Amount',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>
              {(pro?.sell?.quantity * pro?.sell?.sellingPrice)?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Vats',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.sell?.vats?.toFixed(2)}%</li>
          </ul>
        )),
    },
    {
      title: 'VA',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>
              {((pro?.sell?.sellingPrice * pro?.sell?.vats) / 100)?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Discounts',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.sell?.discounts?.toFixed(2)}%</li>
          </ul>
        )),
    },
    {
      title: 'DA',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => (
          <ul key={pro.productName}>
            <li>
              {(
                (pro?.sell?.sellingPrice * pro?.sell?.discounts) /
                100
              )?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Total',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) =>
        products.map((pro: any) => {
          const total = calculateTotal(pro)
          return (
            <ul key={pro.productName}>
              <li>{total}</li>
            </ul>
          )
        }),
    },
    {
      title: 'Sub Total',
      dataIndex: 'customerPurchaseProducts',
      key: 'customerPurchaseProducts',
      render: (products: any) => <span>{calculateSubTotal(products)}</span>,
    },
  ]

  // Prepare data for CSV/PDF export
  const prepareExportData = () => {
    return data
      .map((row: any, index: number) => {
        const products = row.customerPurchaseProducts || []
        return products.map((pro: any) => ({
          Transaction: `TXN-${index + 1}`,
          Name: pro.productName,
          'Selling Price': pro?.sell?.sellingPrice?.toFixed(2),
          Qty: pro?.sell?.quantity,
          Amount: (pro?.sell?.quantity * pro?.sell?.sellingPrice)?.toFixed(2),
          Vats: `${pro?.sell?.vats?.toFixed(2)}%`,
          VA: ((pro?.sell?.sellingPrice * pro?.sell?.vats) / 100)?.toFixed(2),
          Discounts: `${pro?.sell?.discounts?.toFixed(2)}%`,
          DA: ((pro?.sell?.sellingPrice * pro?.sell?.discounts) / 100)?.toFixed(
            2
          ),
          Total: calculateTotal(pro),
          SubTotal: calculateSubTotal(products),
        }))
      })
      .flat()
  }

  // Handle CSV download
  const handleDownloadCSV = () => {
    const exportData = prepareExportData()
    const fields = [
      'Transaction',
      'Name',
      'Selling Price',
      'Qty',
      'Amount',
      'Vats',
      'VA',
      'Discounts',
      'DA',
      'Total',
      'SubTotal',
    ]
    const csv = parse(exportData, { fields })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Sell-reports.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Sell Reports', 0, 0)
    autoTable(doc, {
      head: [
        [
          'Transaction',
          'Name',
          'Selling Price',
          'Qty',
          'Amount',
          'Vats',
          'VA',
          'Discounts',
          'DA',
          'Total',
          'SubTotal',
        ],
      ],
      body: prepareExportData().map((item: any) => [
        item.Transaction,
        item.Name,
        item['Selling Price'],
        item.Qty,
        item.Amount,
        item.Vats,
        item.VA,
        item.Discounts,
        item.DA,
        item.Total,
        item.SubTotal,
      ]),
    })
    doc.save('Sell-reports.pdf')
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleDownloadCSV} type="primary">
          Download CSV
        </Button>
        <Button onClick={handleDownloadPDF} type="default">
          Download PDF
        </Button>
        <Button type="default">Print</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => record.id}
        pagination={false}
        bordered
        loading={loading}
      />
    </div>
  )
}

export default SellReports
