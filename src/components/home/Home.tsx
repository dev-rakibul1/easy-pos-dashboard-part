'use client'
import {
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
  RedoOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import { Button, Card, Col, Row, Typography } from 'antd'
import React from 'react'
import SalesLineChart from './HomePageChart'

const { Title } = Typography

const HomeDesign: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '20px' }}
      >
        <Title level={2}>Welcome Back, User</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          New Sale
        </Button>
      </Row>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Title level={5}>Total Stock</Title>
            <p>250 Units</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            <Title level={5}>Last Month Total Profit</Title>
            <p>$12,500</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <DollarOutlined style={{ fontSize: '24px', color: '#faad14' }} />
            <Title level={5}>Last Month Total Sales</Title>
            <p>$20,000</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <DollarOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
            <Title level={5}>Last Month Total Due</Title>
            <p>$3,000</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <RedoOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
            <Title level={5}>Total Returns</Title>
            <p>15 Returns</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <FileTextOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
            <Title level={5}>Last Month Total Purchase</Title>
            <p>$8,000</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <DollarOutlined style={{ fontSize: '24px', color: '#ff85c0' }} />
            <Title level={5}>Customer Due</Title>
            <p>$2,000</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <DollarOutlined style={{ fontSize: '24px', color: '#fa541c' }} />
            <Title level={5}>Additional Costs</Title>
            <p>$500</p>
          </Card>
        </Col>
      </Row>

      <div style={{ padding: '20px' }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: '20px' }}
        >
          <Title level={2}>Monthly Overview</Title>
        </Row>

        <SalesLineChart />
      </div>
    </div>
  )
}

export default HomeDesign
