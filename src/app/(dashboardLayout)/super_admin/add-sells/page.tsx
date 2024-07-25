'use client'

import PosPage from '@/components/POS/Pos'
import PosSidebar from '@/components/POS/PosSidebar'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import { Col, Row } from 'antd'

const AddSells = () => {
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
            label: `POS`,
            link: `/${role}/add-sells`,
          },
        ]}
      />

      <ActionBar title="Point of sales (POS)"></ActionBar>

      <Row gutter={[0, 0]}>
        <Col xs={24} sm={18} md={18} lg={18}>
          <PosPage />
        </Col>
        <Col
          xs={24}
          sm={6}
          md={6}
          lg={6}
          style={{ overflowX: 'hidden', width: '100%', height: '100vh' }}
        >
          <PosSidebar />
        </Col>
      </Row>
    </div>
  )
}

export default AddSells
