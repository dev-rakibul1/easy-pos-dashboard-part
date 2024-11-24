import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Button, Space, Switch, Table, Typography, theme } from 'antd'
import { parse } from 'json2csv' // For CSV export
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // For PDF table generation
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import ReportTitle from '../companyReportTitle/ReportTitle'

const { Title } = Typography

type IProps = {
  purchaseFilter: any
  loading: boolean
}
const PurchaseReportUI = ({ purchaseFilter, loading }: IProps) => {
  const { token } = theme.useToken()
  const data = purchaseFilter ? purchaseFilter?.purchaseGroups : []

  // Function to calculate total for each product
  const calculateTotal = (product: any) => {
    const purchaseRate = product?.purchase?.purchaseRate || 0
    const quantity = product?.variants?.length || 0
    const vats = product?.purchase?.vats || 0
    const discounts = product?.purchase?.discounts || 0

    const vatAmount = (purchaseRate * vats) / 100
    const discountAmount = (purchaseRate * discounts) / 100
    const total = quantity * purchaseRate + vatAmount - discountAmount

    return total.toFixed(2)
  }

  // Function to calculate subtotal
  const calculateSubTotal = (products: any) => {
    if (!Array.isArray(products)) return '0.00' // Ensure it's an array
    const total = products.reduce((acc: number, pro: any) => {
      const productTotal = parseFloat(calculateTotal(pro)) || 0
      return acc + productTotal
    }, 0)
    return total.toFixed(2)
  }

  // Function to calculate quantity

  const calculateQuantity = (products: any) => {
    if (!Array.isArray(products)) return '0.00' // Ensure it's an array
    return products.reduce((acc: number, pro: any) => {
      const productQuantity = pro?.variants?.length || 0 // Extract quantity
      return acc + productQuantity // Accumulate the quantity
    }, 0)
  }

  // console.log(data)
  const [variantActive, setVariantActive] = useState<boolean>(true)
  const onChange = (checked: boolean) => {
    setVariantActive(checked)
  }

  // Table columns
  const columns = [
    {
      title: 'TXN',
      render: (_: any, __: any, index: number) => (
        <strong>TXN-{index + 1}</strong>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) => (
        <>
          <ul>
            {products?.map((pro: any, i: number) => (
              <li key={pro.id} style={{ marginTop: '5px' }}>
                <strong>
                  {i + 1}. {pro?.productName} | {pro?.modelName}
                </strong>
                {/* Render only the variants of the current product */}
                {variantActive && pro?.variants?.length ? (
                  <ul>
                    {pro.variants.map((va: any, j: number) => (
                      <li key={va?.id}>
                        - {va?.imeiNumber} | {va?.color?.split(' ')[0]} |{' '}
                        {va?.ram}/{va?.rom}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ),
    },

    {
      title: 'Purchase p',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.purchase?.purchaseRate}>
            <li>{pro.purchase?.purchaseRate?.toFixed(2)}</li>
          </ul>
        )),
    },
    {
      title: 'Qty',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.variants?.length}</li>
          </ul>
        )),
    },
    {
      title: 'Amount',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.productName}>
            <li>
              {(pro?.variants?.length * pro.purchase?.purchaseRate)?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Vats',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.productName}>
            <li>{pro?.purchase?.vats?.toFixed(2)}%</li>
          </ul>
        )),
    },
    {
      title: 'VA',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.productName}>
            <li>
              {(
                (pro?.purchase?.purchaseRate * pro?.purchase?.vats) /
                100
              )?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Discounts',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.id}>
            <li>{pro?.purchase?.discounts?.toFixed(2)}%</li>
          </ul>
        )),
    },
    {
      title: 'DA',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro.id}>
            <li>
              {(
                (pro?.purchase?.purchaseRate * pro?.purchase?.discounts) /
                100
              )?.toFixed(2)}
            </li>
          </ul>
        )),
    },
    {
      title: 'Total',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) =>
        products?.map((pro: any) => {
          const total = calculateTotal(pro)
          return (
            <ul key={pro.id}>
              <li>{total}</li>
            </ul>
          )
        }),
    },
    {
      title: 'Sub Total',
      dataIndex: 'supplierSellProducts',
      key: 'supplierSellProducts',
      render: (products: any) => <span>{calculateSubTotal(products)}</span>,
    },
  ]

  // Prepare data for CSV/PDF export
  const prepareExportData = () => {
    return data
      .map((row: any, index: number) => {
        const products = row.supplierSellProducts || []
        return products?.map((pro: any) => ({
          Transaction: `TXN-${index + 1}`,
          Name: pro.productName,
          'Purchase rate': pro?.purchase?.purchaseRate?.toFixed(2),
          Qty: pro?.purchase?.quantity,
          Amount: (
            pro?.purchase?.quantity * pro?.purchase?.purchaseRate
          )?.toFixed(2),
          Vats: `${pro?.purchase?.vats?.toFixed(2)}%`,
          VA: (
            (pro?.purchase?.purchaseRate * pro?.purchase?.vats) /
            100
          )?.toFixed(2),
          Discounts: `${pro?.purchase?.discounts?.toFixed(2)}%`,
          DA: (
            (pro?.purchase?.purchaseRate * pro?.purchase?.discounts) /
            100
          )?.toFixed(2),
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
      'Purchase rate', // Correct the field to match data keys
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
    link.setAttribute('download', 'Purchase-reports.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Purchase Reports', 0, 0)
    autoTable(doc, {
      head: [
        [
          'Transaction',
          'Name',
          'Purchase rate',
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
        item['Purchase rate'],
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
    doc.save('Purchase-reports.pdf')
  }

  // Print
  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  return (
    <div>
      <Space
        size="middle"
        style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}
      >
        <Button
          onClick={handleDownloadCSV}
          type="primary"
          icon={<DownloadOutlined />}
        >
          Download CSV
        </Button>
        <Button
          onClick={handleDownloadPDF}
          type="default"
          icon={<DownloadOutlined />}
        >
          Download PDF
        </Button>
        <Button onClick={handlePrint} type="default" icon={<PrinterOutlined />}>
          Print
        </Button>
        <Switch
          defaultChecked
          checkedChildren="Show Variants"
          unCheckedChildren="Hide Variants"
          onChange={onChange}
          style={{ marginLeft: 'auto' }}
        />
      </Space>

      <div
        // @ts-ignore
        ref={componentRef}
        style={{
          // @ts-ignore
          border: `1px solid ${token?.colorPrimaryLight || '#ccc'}`,
          borderRadius: '5px',
        }}
      >
        <ReportTitle invoiceType="sales Reports" active={false} />
        <Title
          level={5}
          style={{ textAlign: 'center', textTransform: 'uppercase' }}
        >
          Purchase Reports
        </Title>

        <Table
          columns={columns}
          dataSource={data}
          rowKey={record => record.id}
          pagination={false}
          bordered
          loading={loading}
          summary={pageData => {
            let totalVA = 0
            let totalDA = 0
            let totalSubTotal = 0
            let totalQuantity = 0

            // Calculate totals
            pageData.forEach((row: any) => {
              const products = row.supplierSellProducts || []
              products.forEach((pro: any) => {
                totalVA +=
                  (pro?.purchase?.purchaseRate * pro?.purchase?.vats || 0) / 100
                totalDA +=
                  (pro?.purchase?.purchaseRate * pro?.purchase?.discounts ||
                    0) / 100
                totalQuantity += pro?.variants?.length || 0 // Sum quantity here
              })
              totalSubTotal += parseFloat(calculateSubTotal(products)) || 0
            })

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell
                  colSpan={3}
                  index={1}
                  // @ts-ignore
                  style={{ textAlign: 'right' }}
                >
                  <strong>Grand Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>{totalQuantity}</strong>{' '}
                  {/* Display total quantity */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={3}>
                  <strong>{totalVA?.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6}>
                  <strong>{totalDA?.toFixed(2)}</strong>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={7} />
                <Table.Summary.Cell index={8}>
                  <strong>{totalSubTotal?.toFixed(2)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </div>
    </div>
  )
}

export default PurchaseReportUI
