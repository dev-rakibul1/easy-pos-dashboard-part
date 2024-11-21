'use client'
import { useGetAllPurchaseByCurrentDateQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetSellByCurrentDateQuery } from '@/redux/api/sells/sellsApi'
import { IPurchase, ISell } from '@/types'
import { DollarCircleOutlined } from '@ant-design/icons'
import { Card, Col, Layout, Row, Space, Typography } from 'antd'
import {
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'

const { Content } = Layout
const { Title } = Typography

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
)

const HomeDailyChart: React.FC = () => {
  const { data: sales } = useGetSellByCurrentDateQuery({ limit: 100 })
  const { data: purchase } = useGetAllPurchaseByCurrentDateQuery({
    limit: 100,
  })

  // @ts-ignore
  const purchaseInfo: IPurchase[] = purchase?.purchases ?? []

  const salesArray = sales?.map((data: ISell) => data.sellingPrice)
  const purchaseArray = purchaseInfo?.map((data: IPurchase) => data.totalPrice)

  const salesCount: number = salesArray?.length
  // @ts-ignore
  const purchaseCount: number = purchase?.purchases?.length

  console.log(salesCount)

  const maxValue = Math.max(salesCount, purchaseCount)

  let createLabels: string[] = []

  // Generate labels based on the maximum count
  for (let i = 0; i < maxValue; i++) {
    createLabels.push(`TXN-${i + 1}`)
  }

  console.log(createLabels)
  // Sample chart data for sales and purchases (with smart gradient effect)
  const chartData = {
    labels: createLabels,
    datasets: [
      {
        label: 'Sales',
        data: salesArray,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)', // Light gradient for fill
        borderWidth: 2, // Smartly defined line width
        tension: 0.4, // Smooth line effect
        fill: true,
      },
      {
        label: 'Purchases',
        data: purchaseArray,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)', // Light gradient for fill
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart options for a smart design with tooltips and smooth animation
  const chartOptions = {
    animation: {
      duration: 2000, // Duration of each animation cycle in ms
      loop: false, // Loop the animation infinitely
      easing: 'easeInOutQuad', // Optional: Animation easing function
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: '#000',
          font: {
            size: 12,
            //   family: 'Arial',
            weight: 200,
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Sales & Purchases',
        color: '#FF6384',
        font: {
          size: 16,
          // family: 'Arial',
          weight: 200,
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'lime',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 10,
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Arial',
        },
        bodyFont: {
          size: 12,
          // family: 'Arial',
        },
        // @ts-ignore
        titleColor: '#FF6384',
        // @ts-ignore
        bodyColor: '#000',
      },
    },
    elements: {
      line: {
        tension: 0.15, // Smoothing effect for line curves
      },
    },
  }

  return (
    <Layout style={{ padding: '16px', backgroundColor: '#f0f2f5' }}>
      <Content>
        <Row gutter={[16, 16]} justify="center">
          {/* Sales & Purchases Chart Section */}
          <Col span={24}>
            <Card
              title={
                <Space>
                  <DollarCircleOutlined
                    style={{ color: '#52c41a', fontSize: '28px' }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    Todays Sales & Purchases
                  </Title>
                </Space>
              }
              bordered={false}
              style={{
                borderRadius: '12px',
                background: '#fff',
              }}
            >
              {/*@ts-ignore*/}
              <Line data={chartData} options={chartOptions} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default HomeDailyChart
