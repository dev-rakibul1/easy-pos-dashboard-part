'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import WarrantyForm from '@/components/warranty/WarrantyForm'
import { useGetSellByImeiNumberQuery } from '@/redux/api/sells/sellsApi'
import { getUserInfo } from '@/services/auth.services'
import { getWarrantyDate } from '@/utils/warranty/warrantyDate'
import { BarcodeOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Descriptions,
  Empty,
  Input,
  message,
  Row,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
const { Title } = Typography

interface ImeiSearchProps {
  onSearch: (imei: string) => void
}

let singleCustomerById = {
  name: 'ac',
}

const WarrantyPage: React.FC<ImeiSearchProps> = () => {
  const { role } = getUserInfo() as any
  const [imei, setImei] = useState<string>('')
  const id = imei

  const { data } = useGetSellByImeiNumberQuery(id)

  const handleSearch = () => {
    const imeiRegex = /^[0-9]/
    if (!imeiRegex.test(imei)) {
      message.error('Invalid IMEI number. Please enter a IMEI number.')
      return
    }

    console.log('Entered IMEI:', imei)

    setImei('')
  }

  console.log(data)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: 'Warranty',
            link: `/${role}/add-warranty`,
          },
        ]}
      />

      <ActionBar title="Create a new warranty" />

      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%', marginTop: '25px' }}
      >
        <Input
          placeholder="Enter IMEI number"
          prefix={<BarcodeOutlined />}
          value={imei}
          onChange={e => setImei(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          block
        >
          Search IMEI
        </Button>
      </Space>

      {/* User info */}
      <Row gutter={[32, 32]} style={{ marginTop: '25px' }}>
        {imei &&
          (!data ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '50vh',
              }}
            >
              <Empty
                description="Product not available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Title level={4}>Scan Product Information</Title>
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: '20px auto',
                  }}
                  contentStyle={{ padding: '8px 16px' }}
                  labelStyle={{ padding: '8px 16px', fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="Name">
                    {data?.customerPurchaseProduct?.productName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Model">
                    {data?.customerPurchaseProduct?.modelName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ram">
                    {`${data?.customerPurchaseVariants?.ram} GB` || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rom">
                    {`${data?.customerPurchaseVariants?.rom} GB` || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Color">
                    {data?.customerPurchaseVariants?.color || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Selling ID">
                    {data?.uniqueId || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Selling Date">
                    {data?.createdAt
                      ? dayjs(data.createdAt).format('D MMM, YYYY hh:mm A')
                      : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Calculate Date">
                    {data?.createdAt ? getWarrantyDate(data.createdAt) : 'N/A'}
                  </Descriptions.Item>
                </Descriptions>

                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: '20px auto',
                  }}
                  contentStyle={{ padding: '8px 16px' }}
                  labelStyle={{ padding: '8px 16px', fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="Name">
                    {`${data?.customer?.firstName || ''} ${
                      data?.customer?.middleName || ''
                    } ${data?.customer?.lastName || ''}`.trim() || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {data?.customer?.phoneNo || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {data?.customer?.email || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="NID">
                    {data?.customer?.nid || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {data?.customer?.presentAddress || 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12}>
                {/* Warranty form */}
                <WarrantyForm data={data} />
              </Col>
            </>
          ))}
      </Row>
    </div>
  )
}

export default WarrantyPage
