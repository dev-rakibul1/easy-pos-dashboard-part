'use client'

import PosSidebar from '@/components/POS/PosSidebar'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ReturnToSupplier from '@/components/returnToSupplier/Return'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import { Col, Row } from 'antd'

const ReturnPage = () => {
  const { role } = getUserInfo() as any
  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Return`,
            link: `/${role}/add-return`,
          },
        ]}
      />

      <ActionBar title="Return product to supplier"></ActionBar>

      <Row gutter={[0, 0]}>
        <Col xs={24} sm={18} md={18} lg={18}>
          <ReturnToSupplier />
        </Col>
        <Col xs={24} sm={6} md={6} lg={6}>
          <PosSidebar />
        </Col>
      </Row>
    </div>
  )
}

export default ReturnPage
