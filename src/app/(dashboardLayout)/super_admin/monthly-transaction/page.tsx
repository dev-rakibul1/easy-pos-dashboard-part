'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import { flexBetween } from '@/components/styles/style'
import MonthlyTransactionReport from '@/components/transaction/tabs/monthlyTransaction/MonthlyTransactionReport'
import ActionBar from '@/components/ui/ActionBar'
import { currencyName } from '@/constants/global'
import { useGetAllPurchaseByCurrentMonthQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetPurchaseGroupByCurrentMonthQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetAllReturnsByCurrentMonthQuery } from '@/redux/api/returnApi/returnApi'
import { useGetAllReturnGroupByCurrentMonthQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useGetSellGroupByCurrentMonthQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useGetSellByCurrentMonthQuery } from '@/redux/api/sells/sellsApi'

import { getUserInfo } from '@/services/auth.services'
import { IPurchase, IReturn, ISell } from '@/types'
import { calculateProfit } from '@/utils/calculateProfit'
import { Button, Card, Col, Row, Statistic } from 'antd'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
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

const CustomizedAxisTick: FC<any> = ({ x, y, stroke, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  )
}

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

function getDaysInCurrentMonth(): string[] {
  const days: string[] = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      new Date(year, month, i).toLocaleDateString('default', {
        day: 'numeric',
        month: 'short',
      })
    )
  }
  return days
}

function mapDataToDays(
  sales: ISell[],
  purchases: IPurchase[],
  returns: IReturn[]
): SalesData[] {
  const days = getDaysInCurrentMonth()
  const salesData = days.map(day => ({
    name: day,
    sales: 0,
    purchases: 0,
    returns: 0,
  }))

  sales?.forEach(transaction => {
    const date = new Date(transaction.createdAt)
    const day = salesData.find(
      d => new Date(d.name).getDate() === date.getDate()
    )
    if (day) {
      day.sales += transaction.totalSellPrice
    }
  })

  purchases?.forEach(purchase => {
    const date = new Date(purchase.createdAt)
    const day = salesData.find(
      d => new Date(d.name).getDate() === date.getDate()
    )
    if (day) {
      day.purchases += purchase.totalPrice
    }
  })

  returns?.forEach(returnItem => {
    const date = new Date(returnItem.createdAt)
    const day = salesData.find(
      d => new Date(d.name).getDate() === date.getDate()
    )
    if (day) {
      day.returns += returnItem.price
    }
  })

  return salesData
}

function MonthlyTransaction() {
  const { role } = getUserInfo() as any
  const { data: salesData } = useGetSellByCurrentMonthQuery({ limit: 1200 })
  const { data: purchase } = useGetAllPurchaseByCurrentMonthQuery({
    limit: 1200,
  })
  const { data: returns } = useGetAllReturnsByCurrentMonthQuery({ limit: 1200 })
  const { data: purchaseGroups } = useGetPurchaseGroupByCurrentMonthQuery({
    limit: 1200,
  })
  const { data: sellGroups } = useGetSellGroupByCurrentMonthQuery({
    limit: 1200,
  })
  const { data: returnsGroups } = useGetAllReturnGroupByCurrentMonthQuery({
    limit: 1200,
  })
  const [dailyData, setDailyData] = useState<SalesData[]>([])

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const purchaseData: IPurchase[] = purchase?.purchases || []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const returnData: IReturn[] = returns?.returns || []

  useEffect(() => {
    if (salesData && purchaseData && returnData) {
      const mappedData = mapDataToDays(salesData, purchaseData, returnData)
      setDailyData(mappedData)
    }
  }, [salesData, purchaseData, returnData])

  const getTitle = (profit: number): string =>
    profit >= 0 ? 'Total Profit' : 'Total Loss'

  const getValueStyle = (profit: number): React.CSSProperties => ({
    color: profit >= 0 ? 'green' : 'red',
  })

  const totalRevenue: number = salesData?.reduce(
    (acc: number, sell: ISell) => acc + sell.totalSellPrice,
    0
  )

  const customerCount = new Set(
    salesData?.map((sell: ISell) => sell.customerId)
  ).size

  const sales = salesData
  const profitAndCost: ProfitAndCost = calculateProfit(sales)
  const totalProfit = profitAndCost?.totalProfit ?? 0

  console.log(salesData)
  console.log(sellGroups)

  return (
    <div style={{ padding: 24 }}>
      <PosBreadcrumb
        items={[
          { label: `${role}`, link: `/${role}` },
          {
            label: `Monthly transaction`,
            link: `/${role}/monthly-transaction`,
          },
        ]}
      />

      <div style={flexBetween}>
        <ActionBar title="Monthly report"></ActionBar>
        <Link href={`/${role}/monthly-transaction/vat-reports`}>
          {' '}
          <Button> Vats report</Button>
        </Link>
      </div>

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
          <Card title="Monthly sales, purchase and return report">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={<CustomizedAxisTick />}
                  interval={0}
                />
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
        <MonthlyTransactionReport
          sellGroups={sellGroups}
          purchaseGroups={purchaseGroups}
          sales={salesData}
          // @ts-ignore
          purchases={purchase}
          returnsGroups={returnsGroups}
          returns={returns}
        />
      </Row>
    </div>
  )
}

export default MonthlyTransaction
