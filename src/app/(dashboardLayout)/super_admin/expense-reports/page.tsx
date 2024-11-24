'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ExpenseReportUI from '@/components/expenseReport/ExpenseReports'
import ActionBar from '@/components/ui/ActionBar'
import { useAdditionalExpenseFilterByStartAndEndDateQuery } from '@/redux/api/additionalExpense/additionalExpenseApi'
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

const ExpenseReports = () => {
  const { role } = getUserInfo() as ITokenObj

  const [form] = Form.useForm()
  const [dates, setDates] = useState<{
    startDate: string
    endDate: string
  } | null>(null)

  const queryArgs = dates || { startDate: '', endDate: '' }
  const skipQuery = !dates?.startDate || !dates?.endDate

  const { data, isFetching, isLoading } =
    useAdditionalExpenseFilterByStartAndEndDateQuery(queryArgs, {
      skip: skipQuery,
    })

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
    setDates(null) // Reset dates to clear the query
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          { label: `${role}`, link: `/${role}` },
          { label: 'Expense report', link: `/${role}/expense-reports` },
        ]}
      />

      <ActionBar title="Expense report filter by start date & end date.">
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
      {!dates ? (
        <Empty description="Please filter expense reports" />
      ) : (
        <ExpenseReportUI expense={data} loading={isLoading} dateRange={dates} />
      )}
    </div>
  )
}

export default ExpenseReports
