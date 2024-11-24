import { IAdditionalExpense, IDateRange } from '@/types'
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Button, Empty, Space, Table, Typography, theme } from 'antd'
import dayjs from 'dayjs'
import { parse } from 'json2csv' // For CSV export
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // For PDF table generation
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ReportTitle from '../companyReportTitle/ReportTitle'

const { Title } = Typography

type IProps = {
  expense: any
  loading: boolean
  dateRange: IDateRange | null
}
const ExpenseReportUI = ({ expense, loading, dateRange }: IProps) => {
  const { token } = theme.useToken()
  const data = expense ? expense?.additionalExpense : []

  // Table columns
  const columns = [
    {
      title: 'EXP',
      render: (_: any, __: any, index: number) => (
        <strong>EXP-{index + 1}</strong>
      ),
    },

    {
      title: 'EXP ID',
      dataIndex: 'uniqueId',
      key: 'uniqueId',
    },
    {
      title: 'EXP Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data: IAdditionalExpense) => {
        return dayjs(data.createdAt).format('D MMM, YYYY hh:mm A')
      },
    },
    {
      title: 'Case',
      dataIndex: 'details',
      key: 'details',
      width: '40%',
    },

    {
      title: 'Expense Amount',
      dataIndex: 'expenseAmount',
      key: 'expenseAmount',
    },
  ]

  // Prepare data for CSV/PDF export
  const prepareExportData = () => {
    return data.map((row: IAdditionalExpense, index: number) => {
      return {
        Transaction: `EXP-${index + 1}`,
        Exp_ID: row.uniqueId,
        Exp_Date: dayjs(row.createdAt).format('D MMM, YYYY hh:mm A'),
        Details: row?.details,
        Amount: row?.expenseAmount,
        Total: total(data), // Ensure `total` function is correctly defined
      }
    })
  }

  // Handle CSV download
  const handleDownloadCSV = () => {
    const exportData = prepareExportData()
    const fields = [
      'Transaction',
      'Exp_ID',
      'Exp_Date',
      'Details',
      'Amount',
      'Total',
    ]

    const csv = parse(exportData, { fields })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Additional-expense-reports.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Additional Expense Reports', 0, 0)
    autoTable(doc, {
      head: [
        ['Transaction', 'Exp_ID', 'Exp_Date', 'Details', 'Amount', 'Total'],
      ],
      body: prepareExportData().map((item: any) => [
        item.Transaction,
        item.Exp_ID,
        item.Exp_Date,
        item.Details,
        item.Amount,
        item.Total,
      ]),
    })
    doc.save('Additional-expense-reports.pdf')
  }

  // Print
  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  const total = (data: IAdditionalExpense[]) =>
    data?.reduce(
      (acc: number, item: IAdditionalExpense) =>
        acc + (item?.expenseAmount || 0),
      0
    )

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
                Additional expense reports
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
              // @ts-ignore
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
                      colSpan={4}
                      index={1}
                      // @ts-ignore
                      style={{ textAlign: 'right' }}
                    >
                      <strong>Grand Total</strong>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={2}>
                      <strong>{total(data)}</strong>
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

export default ExpenseReportUI
