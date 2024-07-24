'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import YearlyTransactionReport from '@/components/transaction/tabs/yearlyTransaction/YearlyTransaction'
import { currencyName } from '@/constants/global'
import { useGetAllAdditionalExpenseByCurrentYearQuery } from '@/redux/api/additionalExpense/additionalExpenseApi'
import { useGetAllPurchaseByCurrentYearQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetPurchaseGroupByCurrentYearQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetAllReturnsByCurrentYearQuery } from '@/redux/api/returnApi/returnApi'
import { useGetAllReturnGroupByCurrentYearQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useGetSellGroupByCurrentYearQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useGetSellByCurrentYearQuery } from '@/redux/api/sells/sellsApi'
import { getUserInfo } from '@/services/auth.services'
import { IPurchase, IReturn, ISell } from '@/types'
import { calculateProfit } from '@/utils/calculateProfit'
import { calculateTotalExpense } from '@/utils/VATDiscountCal'
import { Card, Col, Row, Statistic } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ProfitAndCost {
  totalProfit: number
  totalCost: number
}

// Generate the last 12 months in the format "Month YYYY"
function getLast12Months(): string[] {
  const last12Months = []
  const today = dayjs()
  for (let i = 11; i >= 0; i--) {
    last12Months.push(today.subtract(i, 'month').format('MMMM YYYY'))
  }
  return last12Months
}

// Map the transactions data to the last 12 months
interface ChartData {
  name: string
  sales: number
  purchases: number
  returns: number
}

function mapDataToLast12Months(
  sales: ISell[],
  purchases: IPurchase[],
  returns: IReturn[]
): ChartData[] {
  const last12Months = getLast12Months()
  const salesData = last12Months.map(month => ({
    name: month,
    sales: 0,
    purchases: 0,
    returns: 0,
  }))

  sales.forEach(transaction => {
    const date = dayjs(transaction.createdAt)
    const monthName = date.format('MMMM YYYY')
    const index = salesData.findIndex(item => item.name === monthName)
    if (index !== -1) {
      salesData[index].sales += transaction.totalSellPrice
    }
  })

  purchases.forEach(purchase => {
    const date = dayjs(purchase.createdAt)
    const monthName = date.format('MMMM YYYY')
    const index = salesData.findIndex(item => item.name === monthName)
    if (index !== -1) {
      salesData[index].purchases += purchase.totalPrice
    }
  })

  returns.forEach(returnItem => {
    const date = dayjs(returnItem.createdAt)
    const monthName = date.format('MMMM YYYY')
    const index = salesData.findIndex(item => item.name === monthName)
    if (index !== -1) {
      salesData[index].returns += returnItem.price
    }
  })

  return salesData
}

function YearlyTransaction() {
  const { role } = getUserInfo() as any
  const { data: salesData = [] } = useGetSellByCurrentYearQuery({ limit: 1000 })
  const { data: purchaseData = { purchases: [] } } =
    useGetAllPurchaseByCurrentYearQuery({ limit: 1000 })
  const { data: returnData = { returns: [] } } =
    useGetAllReturnsByCurrentYearQuery({ limit: 1000 })

  const { data: sellGroups } = useGetSellGroupByCurrentYearQuery({
    limit: 1000,
  })
  const { data: purchaseGroups } = useGetPurchaseGroupByCurrentYearQuery({
    limit: 1000,
  })
  const { data: returnsGroups } = useGetAllReturnGroupByCurrentYearQuery({
    limit: 1000,
  })
  const { data: additionalExpense } =
    useGetAllAdditionalExpenseByCurrentYearQuery({
      limit: 100,
    })

  const [yearlyData, setYearlyData] = useState<ChartData[]>([])

  const getTitle = (profit: number): string =>
    profit >= 0 ? 'Total Profit' : 'Total Loss'

  const getValueStyle = (profit: number): React.CSSProperties => ({
    color: profit >= 0 ? 'green' : 'red',
  })

  useEffect(() => {
    if (salesData && purchaseData && returnData) {
      const mappedData = mapDataToLast12Months(
        salesData,
        // @ts-ignore
        purchaseData.purchases,
        returnData.returns
      )
      setYearlyData(mappedData)
    }
  }, [salesData, purchaseData, returnData])

  // Assuming additionalExpense is of type AdditionalExpenseData | undefined
  const expenseAmount = calculateTotalExpense(
    // @ts-ignore
    additionalExpense?.expenses.length ? additionalExpense.expenses : []
  )

  console.log(expenseAmount)
  console.log(additionalExpense)

  // calculate profit and cost
  const sales = salesData
  const profitAndCost: ProfitAndCost = calculateProfit(sales, expenseAmount)
  const totalProfit = profitAndCost?.totalProfit ?? 0

  const customerCount = new Set(salesData.map((sell: ISell) => sell.customerId))
    .size

  const totalRevenue: number =
    salesData.reduce(
      (acc: number, sell: ISell) => acc + sell.totalSellPrice,
      0
    ) ?? 0

  return (
    <div style={{ padding: 24 }}>
      <PosBreadcrumb
        items={[
          { label: `${role}`, link: `/${role}` },
          { label: `Yearly transaction`, link: `/${role}/yearly-transaction` },
        ]}
      />

      <Row gutter={[16, 16]} style={{ marginTop: '15px' }}>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={currencyName}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card>
            <Statistic title="Total Customers" value={customerCount} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Total Cost"
              value={profitAndCost.totalCost}
              precision={2}
              prefix={currencyName}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title={getTitle(totalProfit)}
              value={totalProfit}
              precision={2}
              prefix={currencyName}
              valueStyle={getValueStyle(totalProfit)}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card title="Yearly sales, purchase and return report">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#03B0B3" />
                <Bar dataKey="purchases" fill="#18526A" />
                <Bar dataKey="returns" fill="#0F67B1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <YearlyTransactionReport
          sellGroups={sellGroups}
          purchaseGroups={purchaseGroups}
          sales={salesData}
          // @ts-ignore
          purchases={purchaseData}
          returnsGroups={returnsGroups}
          returns={returnData}
          expenseAmount={expenseAmount}
        />
      </Row>
    </div>
  )
}

export default YearlyTransaction
