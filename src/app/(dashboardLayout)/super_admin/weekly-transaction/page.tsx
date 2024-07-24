'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import WeeklyTransactionReport from '@/components/transaction/tabs/WeeklyTransaction/WeeklyTransactionReport'
import { currencyName } from '@/constants/global'
import { useGetAllAdditionalExpenseByCurrentWeekQuery } from '@/redux/api/additionalExpense/additionalExpenseApi'
import { useGetAllPurchaseByCurrentWeekQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetPurchaseGroupByCurrentWeekQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetAllReturnsByCurrentWeekQuery } from '@/redux/api/returnApi/returnApi'
import { useGetAllReturnGroupByCurrentWeekQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useGetSellGroupByCurrentWeekQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useGetSellByCurrentWeekQuery } from '@/redux/api/sells/sellsApi'
import { getUserInfo } from '@/services/auth.services'
import { IPurchase, IReturn, ISell } from '@/types'
import { calculateProfit } from '@/utils/calculateProfit'
import { calculateTotalExpense } from '@/utils/VATDiscountCal'
import { Card, Col, Row, Statistic } from 'antd'
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

// Define TypeScript types for your aggregated data
interface SalesData {
  name: string
  sales: number
  purchases: number
  returns: number
}

interface ProfitAndCost {
  totalProfit: number
  totalCost: number
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function getLast7Days(): string[] {
  const last7Days: string[] = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() - i - 1) // end with yesterday
    last7Days.push(daysOfWeek[day.getDay()])
  }
  return last7Days.reverse()
}

function mapDataToLast7Days(
  sales: ISell[],
  purchases: IPurchase[],
  returns: IReturn[]
): SalesData[] {
  const last7Days = getLast7Days()
  const salesData = last7Days.map(day => ({
    name: day,
    sales: 0,
    purchases: 0,
    returns: 0,
  }))

  sales?.forEach(transaction => {
    const date = new Date(transaction.createdAt)
    const dayName = daysOfWeek[date.getDay()]
    const index = salesData.findIndex(item => item.name === dayName)
    if (index !== -1) {
      salesData[index].sales += transaction.totalSellPrice
    }
  })

  purchases?.forEach(purchase => {
    const date = new Date(purchase.createdAt)
    const dayName = daysOfWeek[date.getDay()]
    const index = salesData.findIndex(item => item.name === dayName)
    if (index !== -1) {
      salesData[index].purchases += purchase.totalPrice
    }
  })

  returns?.forEach(returnItem => {
    const date = new Date(returnItem.createdAt)
    const dayName = daysOfWeek[date.getDay()]
    const index = salesData.findIndex(item => item.name === dayName)
    if (index !== -1) {
      salesData[index].returns += returnItem.price
    }
  })

  return salesData
}

function WeeklyTransaction() {
  const { role } = getUserInfo() as any
  const { data: salesData } = useGetSellByCurrentWeekQuery({ limit: 100 })
  const { data: purchase } = useGetAllPurchaseByCurrentWeekQuery({ limit: 100 })
  const { data: returns } = useGetAllReturnsByCurrentWeekQuery({ limit: 100 })
  const { data: sellGroups } = useGetSellGroupByCurrentWeekQuery({ limit: 100 })
  const { data: purchaseGroups } = useGetPurchaseGroupByCurrentWeekQuery({
    limit: 100,
  })

  const { data: returnsGroups } = useGetAllReturnGroupByCurrentWeekQuery({
    limit: 100,
  })
  const [weeklyData, setWeeklyData] = useState<SalesData[]>([])

  const { data: additionalExpense } =
    useGetAllAdditionalExpenseByCurrentWeekQuery({
      limit: 100,
    })

  // Function to determine title based on profit value
  const getTitle = (profit: number): string =>
    profit >= 0 ? 'Total Profit' : 'Total Loss'

  // Function to determine value style based on profit value
  const getValueStyle = (profit: number): React.CSSProperties => ({
    color: profit >= 0 ? 'green' : 'red',
  })

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const purchaseData: IPurchase[] = purchase?.purchases || []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const returnData: IReturn[] = returns?.returns || []

  useEffect(() => {
    if (salesData && purchaseData && returnData) {
      const mappedData = mapDataToLast7Days(salesData, purchaseData, returnData)
      setWeeklyData(mappedData)
    }
  }, [salesData, purchaseData, returnData])

  // Assuming additionalExpense is of type AdditionalExpenseData | undefined
  const expenseAmount = calculateTotalExpense(
    // @ts-ignore
    additionalExpense?.expenses.length ? additionalExpense.expenses : []
  )

  // calculate profit and cost
  const sales = salesData
  const profitAndCost: ProfitAndCost = calculateProfit(sales, expenseAmount)
  const totalProfit = profitAndCost?.totalProfit ?? 0

  // total customers
  const customerCount = new Set(
    salesData?.map((sell: ISell) => sell.customerId)
  ).size

  const totalRevenue: number = salesData?.reduce(
    (acc: number, sell: ISell) => acc + sell.totalSellPrice,
    0
  )

  console.log(additionalExpense)

  return (
    <div style={{ padding: 24 }}>
      <PosBreadcrumb
        items={[
          { label: `${role}`, link: `/${role}` },
          { label: `Weekly transaction`, link: `/${role}/weekly-transaction` },
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
              value={profitAndCost?.totalCost}
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
          <Card title="Weekly sales, purchase and return report">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={weeklyData}>
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
        <WeeklyTransactionReport
          sellGroups={sellGroups}
          purchaseGroups={purchaseGroups}
          sales={salesData}
          // @ts-ignore
          purchases={purchase}
          returnsGroups={returnsGroups}
          returns={returns}
          expenseAmount={expenseAmount}
        />
      </Row>
    </div>
  )
}

export default WeeklyTransaction
