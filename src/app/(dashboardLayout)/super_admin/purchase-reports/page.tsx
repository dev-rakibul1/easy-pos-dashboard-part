'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import PurchaseReportUI from '@/components/purchaseReports/PurchaseReportUI'
import ActionBar from '@/components/ui/ActionBar'
import { usePurchaseGroupFilterByStartAndEndDateQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Empty,
  Form,
  Row,
  message,
} from 'antd'
import { useState } from 'react'

const { RangePicker } = DatePicker

const PurchaseReports = () => {
  const { role } = getUserInfo() as ITokenObj

  const [form] = Form.useForm()
  const [dates, setDates] = useState<{
    startDate: string
    endDate: string
  } | null>(null)

  const queryArgs = dates || { startDate: '', endDate: '' }
  const skipQuery = !dates?.startDate || !dates?.endDate

  const { data, isFetching, isLoading } =
    usePurchaseGroupFilterByStartAndEndDateQuery(queryArgs, { skip: skipQuery })

  const onFinish = (values: any) => {
    const [startDate, endDate] = values.dates || []
    if (!startDate || !endDate) {
      message.error('Please select both start and end dates.')
      return
    }
    setDates({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    })
  }

  const onReset = () => {
    form.resetFields()
    setDates(null)
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          { label: `${role}`, link: `/${role}` },
          { label: 'Purchase report', link: `/${role}/purchase-reports` },
        ]}
      />

      <ActionBar title="Purchase report filter by start date & end date.">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: '10px', maxWidth: '100%', width: '100%' }}
        >
          <Row
            gutter={16}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Col xs={24} sm={12} md={12} xl={12}>
              <Form.Item
                name="dates"
                label="Select Date Range"
                rules={[
                  { required: true, message: 'Please select a date range!' },
                ]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  allowClear
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} xl={4}>
              <Form.Item>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Button type="primary" htmlType="submit" loading={isFetching}>
                    Filter
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ActionBar>

      <Divider />

      {/* Display Results */}
      {dates ? (
        <PurchaseReportUI
          purchaseFilter={data}
          loading={isLoading}
          dateRange={dates}
        />
      ) : (
        <Empty description="Please filter purchase reports" />
      )}
    </div>
  )
}

export default PurchaseReports
