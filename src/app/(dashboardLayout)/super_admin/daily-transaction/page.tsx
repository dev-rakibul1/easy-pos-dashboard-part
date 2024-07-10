'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DailyReport from '@/components/transaction/tabs/DailyReport'
import DailyTransactionChart from '@/components/transaction/tabs/DailyTransactionChart'
import ActionBar from '@/components/ui/ActionBar'
import { currencyName } from '@/constants/global'
import { useGetAllPurchaseByCurrentDateQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetPurchaseGroupByCurrentDateQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetAllReturnsByCurrentDateQuery } from '@/redux/api/returnApi/returnApi'
import { useGetAllReturnGroupByCurrentDateQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useGetSellGroupByCurrentDateQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useGetSellByCurrentDateQuery } from '@/redux/api/sells/sellsApi'
import { getUserInfo } from '@/services/auth.services'
import { calculateProfit } from '@/utils/calculateProfit'

import { Card, Col, Row, Statistic, Tabs } from 'antd'
import React from 'react'

// Example type definition for SellData
export interface SellData {
  uniqueId: string
  createdAt: string // Assuming createdAt is a date string
  totalSellPrice: number
  costPrice: number
  customerId: string // Assuming customerId is a string
  // Other properties as per your API response
}

// Define the component function
const DailyTransaction: React.FC = () => {
  const { role } = getUserInfo() as any
  // Fetch data using the API query
  const { data } = useGetSellByCurrentDateQuery({
    limit: 100,
  })
  const { data: purchases } = useGetAllPurchaseByCurrentDateQuery({
    limit: 100,
  })
  const { data: sellGroups } = useGetSellGroupByCurrentDateQuery({
    limit: 100,
  })
  const { data: purchaseGroups } = useGetPurchaseGroupByCurrentDateQuery({
    limit: 100,
  })
  const { data: returns } = useGetAllReturnsByCurrentDateQuery({
    limit: 100,
  })
  const { data: returnsGroups } = useGetAllReturnGroupByCurrentDateQuery({
    limit: 100,
  })

  // Calculate total revenue, total customers, and total profit from sells data for the current day
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const sellsToday: SellData[] =
    data?.filter(
      (sell: SellData) =>
        new Date(sell.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }) === today
    ) || []

  const totalRevenue: number = sellsToday.reduce(
    (acc: number, sell: SellData) => acc + sell.totalSellPrice,
    0
  )

  const totalCustomers: number = new Set(
    sellsToday.map((sell: SellData) => sell.customerId)
  ).size

  // ----------DAILY REPORT INFORMATION----------
  const purchaseInfo = purchases?.purchases
  const returnsInfo = returns?.returns
  const sales = data

  // -----------PROFIT CALCULATION------------
  const profitAndCost = calculateProfit(sales)
  const dailyReportData = {
    purchase: purchaseInfo,
    sales,
    returns: returnsInfo,
    profit: profitAndCost,
  }
  console.log(dailyReportData)

  // Return the JSX for rendering
  return (
    <div style={{ padding: 24 }}>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Daily transaction`,
            link: `/${role}/daily-transaction`,
          },
        ]}
      />

      <ActionBar title="Daily transaction chart and report"></ActionBar>

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
            <Statistic title="Total Customers" value={totalCustomers} />
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
              title="Total Profit"
              value={profitAndCost?.totalProfit}
              precision={2}
              prefix={currencyName}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 16 }}>
        <Tabs.TabPane tab="Charts" key="1">
          <DailyTransactionChart
            sales={data}
            purchases={purchases}
            returns={returns}
          />
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}></Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Daily report" key="2">
          <DailyReport
            sellGroups={sellGroups}
            purchaseGroups={purchaseGroups}
            sales={data}
            // @ts-ignore
            purchases={purchases}
            returnsGroups={returnsGroups}
            returns={returns}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

// Export the component as default
export default DailyTransaction
