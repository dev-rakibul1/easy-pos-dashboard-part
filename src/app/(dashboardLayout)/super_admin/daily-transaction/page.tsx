'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DailyReport from '@/components/transaction/tabs/DailyReport'
import DailyTransactionChart from '@/components/transaction/tabs/DailyTransactionChart'
import ActionBar from '@/components/ui/ActionBar'
import { currencyName } from '@/constants/global'
import {
  useGetAllPurchaseByCurrentDateQuery,
  useGetPurchaseGroupByCurrentDateQuery,
} from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetAllReturnsByCurrentDateQuery } from '@/redux/api/returnApi/returnApi'
import { useGetSellGroupByCurrentDateQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useGetSellByCurrentDateQuery } from '@/redux/api/sells/sellsApi'
import { getUserInfo } from '@/services/auth.services'
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
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })

  const { data: purchases } = useGetAllPurchaseByCurrentDateQuery({
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
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

  console.log('sales', data)
  console.log('purchase', purchases)

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

  const totalProfit: number = sellsToday.reduce(
    (acc: number, sell: SellData) => acc + (sell.totalSellPrice - 96000),
    0
  )

  const returnsInfo = returns?.returns
  console.log(returnsInfo)

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
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={currencyName}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card>
            <Statistic title="Total Customers" value={totalCustomers} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card>
            <Statistic
              title="Total Profit"
              value={totalProfit}
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
            purchases={purchases}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

// Export the component as default
export default DailyTransaction
