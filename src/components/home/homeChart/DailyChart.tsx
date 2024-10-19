'use client'
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

// Sample chart data for sales and purchases (with smart gradient effect)
const chartData = {
  labels: ['12am', '6am', '12pm', '6pm', '12am'],
  datasets: [
    {
      label: 'Sales',
      data: [1000, 700, 1200, 200, 500],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)', // Light gradient for fill
      borderWidth: 2, // Smartly defined line width
      tension: 0.4, // Smooth line effect
      fill: true,
    },
    {
      label: 'Purchases',
      data: [500, 1500, 250, 1500, 1050],
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
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        font: {
          size: 14,
          weight: '500', // Smart weight for labels
        },
      },
    },
    tooltip: {
      backgroundColor: '#fff',
      bodyColor: '#000',
      titleColor: '#000',
      borderColor: '#eaeaea',
      borderWidth: 1,
      bodyFont: {
        size: 14,
        weight: '400',
      },
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          label += `$${context.raw.toFixed(2)}`
          return label
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeOutQuint', // Smooth animation
  },
}

const HomeDailyChart: React.FC = () => {
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
                    Today's Sales & Purchases
                  </Title>
                </Space>
              }
              bordered={false}
              style={{
                borderRadius: '12px',
                background: '#fff',
              }}
            >
              <Line data={chartData} options={chartOptions} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default HomeDailyChart
