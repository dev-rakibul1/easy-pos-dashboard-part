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
  profitFilter: any
  loading: boolean
  dateRange: IDateRange
}
const ProfitReportUI = ({ profitFilter, loading, dateRange }: IProps) => {
  const { token } = theme.useToken()
  const data = profitFilter ? profitFilter?.sells : []

  // console.log(data)
  const [variantActive, setVariantActive] = useState<boolean>(true)
  const onChange = (checked: boolean) => {
    setVariantActive(checked)
  }

  // calculate Qty
  const qty = (data: any[]) => {
    const sum = data?.reduce(
      (acc: number, item: any) => acc + item?.quantity,
      0
    )
    return sum
  }
  // calculate selling price
  const sellingPriceSum = (data: any[]) => {
    const sum = data?.reduce(
      (acc: number, item: any) => acc + item?.sellingPrice,
      0
    )
    return sum
  }
  // calculate purchase price
  const purchasePriceSum = (data: any[]) => {
    const sum = data?.reduce(
      (acc: number, item: any) => acc + item?.purchaseRate,
      0
    )
    return sum
  }

  // Calculate all losses
  const calculateAllProfit = (data: any[]) => {
    const lossArray = data?.map(item => {
      const discount = item?.discounts || 0
      const sellingPrice = item?.sellingPrice || 0
      const discountAmount = (sellingPrice * discount) / 100
      const discountAmountWithQty = discountAmount * (item?.quantity || 0)
      const purchaseRate = item?.purchaseRate || 0

      const sellWithDiscount = sellingPrice - discountAmountWithQty
      const loss = sellWithDiscount - purchaseRate

      return parseFloat(loss.toFixed(2))
    })

    const sum = lossArray.reduce((acc: number, item: number) => acc + item, 0)
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
      key: 'productName',
      render: (_: any, record: any) => (
        <div>
          <strong>
            {`${record.productName?.trim() || 'N/A'} | ${
              record.modelName?.trim() || 'N/A'
            }`}
          </strong>

          {variantActive && (
            <ul>
              {record?.customerPurchaseVariants ? (
                <li>
                  -{' '}
                  {`${
                    record?.customerPurchaseVariants?.imeiNumber || 'N/A'
                  } | ${
                    record?.customerPurchaseVariants?.color?.split(' ')[0] ||
                    'N/A'
                  } | ${record?.customerPurchaseVariants?.ram || 'N/A'}/${
                    record?.customerPurchaseVariants?.rom || 'N/A'
                  }`}
                </li>
              ) : (
                <li>No customer purchase variants available</li>
              )}
            </ul>
          )}

          {variantActive && (
            <ul>
              {record?.customer ? (
                <li>
                  -{' '}
                  {`${record?.customer?.firstName || 'N/A'} | ${
                    record?.customer?.phoneNo || 'N/A'
                  } | ${record?.customer?.email || 'N/A'} | ${
                    record?.customer?.uniqueId || 'N/A'
                  }`}
                </li>
              ) : (
                <li>No customer details available</li>
              )}
            </ul>
          )}
        </div>
      ),
    },
    {
      title: 'Purchase Rate',
      dataIndex: 'purchaseRate',
      key: 'purchaseRate',
      render: (value: any) => parseFloat(value || 0).toFixed(2),
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: (value: any) => parseFloat(value || 0).toFixed(2),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: any) => parseInt(value || 0, 10),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_: any, record: any) => {
        const qty = record?.quantity || 0
        const price = record?.sellingPrice || 0
        const amount = qty * price
        return parseFloat(amount.toString()).toFixed(2)
      },
    },
    {
      title: 'Vats',
      dataIndex: 'vats',
      key: 'vats',
      render: (_: any, record: any) => {
        return `${record?.vats || 0}%`
      },
    },
    {
      title: 'VA',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: any) => {
        const vatPercentage = record?.vats || 0
        const sellingPrice = record?.sellingPrice || 0
        const vatAmount = (sellingPrice * vatPercentage) / 100
        const vatAmountWithQty = vatAmount * record?.quantity || 0
        return parseFloat(vatAmountWithQty.toString()).toFixed(2)
      },
    },
    {
      title: 'Discounts',
      dataIndex: 'discounts',
      key: 'discounts',
      render: (_: any, record: any) => {
        return `${record?.discounts || 0}%`
      },
    },
    {
      title: 'DA',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: any) => {
        const discount = record?.discounts || 0
        const sellingPrice = record?.sellingPrice || 0
        const discountAmount = (sellingPrice * discount) / 100
        const discountAmountWithQty = discountAmount * record?.quantity || 0
        return parseFloat(discountAmountWithQty.toString()).toFixed(2)
      },
    },
    {
      title: 'Profit',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: any) => {
        const discount = record?.discounts || 0
        const sellingPrice = record?.sellingPrice || 0
        const discountAmount = (sellingPrice * discount) / 100
        const discountAmountWithQty = discountAmount * record?.quantity || 0
        const purchaseRate = record?.purchaseRate || 0

        const sellWithDiscount = sellingPrice - discountAmountWithQty
        const profit = sellWithDiscount - purchaseRate

        return parseFloat(profit.toString()).toFixed(2)
      },
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
          Total: '',
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
                Profit Reports
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
                    <Table.Summary.Cell index={2}>
                      <strong>{purchasePriceSum(data)?.toFixed(2)}</strong>{' '}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <strong>{sellingPriceSum(data)?.toFixed(2)}</strong>{' '}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <strong>{qty(data)}</strong>{' '}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />
                    <Table.Summary.Cell index={4} />
                    <Table.Summary.Cell index={5} />
                    <Table.Summary.Cell index={4} />

                    <Table.Summary.Cell index={7} />
                    <Table.Summary.Cell index={8}>
                      <strong>{calculateAllProfit(data)?.toFixed(2)}</strong>
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

export default ProfitReportUI
