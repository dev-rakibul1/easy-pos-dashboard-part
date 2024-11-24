import { IDateRange } from '@/types'
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Button, Empty, Space, Switch, Table, Typography, theme } from 'antd'
import { parse } from 'json2csv' // For CSV export
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // For PDF table generation
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import ReportTitle from '../companyReportTitle/ReportTitle'

const { Title } = Typography

type IProps = {
  returnFilter: any
  loading: boolean
  dateRange: IDateRange | null
}
const ReturnReportsUI = ({ returnFilter, loading, dateRange }: IProps) => {
  const { token } = theme.useToken()
  const data = returnFilter ? returnFilter?.returnGroups : []

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

  // Function to calculate total
  const calculateSubTotal = (products: any) => {
    if (!Array.isArray(products)) return '0.00' // Ensure it's an array

    const total = products.reduce((acc: number, pro: any) => {
      // Calculate total for individual product
      const productTotal = parseFloat(calculateTotal(pro)) || 0

      // Sum up nested "returns" prices if present
      const returnsTotal =
        pro?.userReturnProducts?.reduce((returnAcc: number, returnPro: any) => {
          return (
            returnAcc +
            (returnPro?.returns?.reduce((itemAcc: number, item: any) => {
              return itemAcc + (item?.price || 0)
            }, 0) || 0)
          )
        }, 0) || 0

      return acc + productTotal + returnsTotal
    }, 0)

    return total.toFixed(2) // Return total as a string with 2 decimal places
  }

  const [variantActive, setVariantActive] = useState<boolean>(true)
  const onChange = (checked: boolean) => {
    setVariantActive(checked)
  }

  const aQty = (pro: any) => {
    const sum = pro?.reduce((acc: any, item: any) => {
      return acc + (item?.supplierReturnPayments?.quantity || 0)
    }, 0)
    return sum
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
      dataIndex: 'userReturnProducts',
      key: 'userReturnProducts',
      render: (products: any) => (
        <>
          <ul>
            {products?.map((pro: any, i: number) => (
              <li key={pro.id} style={{ marginTop: '5px' }}>
                <strong>
                  {i + 1}. {pro?.productName} | {pro?.modelName}
                </strong>
                {/* Render only the variants of the current product */}
                {variantActive && pro?.returns?.length ? (
                  <ul>
                    {pro.returns.map((va: any, j: number) => (
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
      title: 'Purchase rate',
      dataIndex: 'userReturnProducts',
      key: 'userReturnProducts',
      render: (products: any) =>
        products?.map((pro: any) => (
          <ul key={pro?.returns?.price}>
            <li>{pro?.returns?.price?.toFixed(2)}</li>

            {/* Render only the variants of the current product */}
            {pro.returns.map((va: any, j: number) => (
              <li key={va?.id}>{va?.price}</li>
            ))}
          </ul>
        )),
    },
    {
      title: 'Quantity',
      dataIndex: 'supplierReturnPayments',
      key: 'supplierReturnPayments',
      render: (products: any) => (
        <ul key={products?.id}>
          <li>{products?.quantity}</li>
        </ul>
      ),
    },

    {
      title: 'Total',
      dataIndex: 'userReturnProducts',
      key: 'userReturnProducts',
      render: (products: any) => {
        if (!products || !Array.isArray(products)) return null

        // Calculate the total purchase rate
        const total = products.reduce((sum: number, pro: any) => {
          const variantTotal = pro.returns?.reduce(
            (variantSum: number, va: any) => {
              return variantSum + (va?.price || 0)
            },
            0
          )

          return sum + (variantTotal || 0)
        }, 0)

        // Render the values with the total
        return <>{total.toFixed(2)}</>
      },
    },
  ]

  // Prepare data for CSV/PDF export
  const prepareExportData = () => {
    return data
      .map((row: any, index: number) => {
        const products = row.userReturnProducts || []
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
          SubTotal: '',
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
    <>
      {data.length === 0 ? (
        <Empty description="Record does not exist." />
      ) : (
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
            <Button
              onClick={handlePrint}
              type="default"
              icon={<PrinterOutlined />}
            >
              Print
            </Button>
            <Switch
              defaultChecked
              checkedChildren="Hide Variants"
              unCheckedChildren="Show Variants"
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
            <div style={{ marginBottom: '20px' }}>
              <ReportTitle invoiceType="sales Reports" active={false} />
              <Title
                level={5}
                style={{ textAlign: 'center', textTransform: 'uppercase' }}
              >
                Return Reports
              </Title>
            </div>
            <p
              style={{
                fontStyle: 'italic',
                textAlign: 'left',
                padding: '1px 15px',
              }}
            >{`Date range: ${dateRange?.startDate} - ${dateRange?.endDate}`}</p>
            <Table
              columns={columns}
              dataSource={data}
              rowKey={record => record.id}
              pagination={false}
              bordered
              loading={loading}
              summary={() => {
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      colSpan={2}
                      index={1}
                      // @ts-ignore
                      style={{ textAlign: 'right' }}
                    >
                      <strong>Grand Total</strong>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={7} />
                    <Table.Summary.Cell index={2}>
                      <strong>{aQty(data)}</strong>{' '}
                      {/* Display total quantity */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <strong>{calculateSubTotal(data)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ReturnReportsUI
