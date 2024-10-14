'use client'

import { WarrantyData } from '@/types'
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
const { Title } = Typography

const { Option } = Select

type IProps = {
  data: WarrantyData
}

const WarrantyForm = ({ data }: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Use useEffect to set initial form values with the API data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        phone: data.customer.phoneNo,
        email: data.customer.email,
        model: `${data.productName} - ${data.modelName}`,
        imei: data.customerPurchaseVariants.imeiNumber,
        purchaseDate: data.createdAt, // Convert to dayjs object
        purchasePlace: dayjs(), // Default to current date
      })
    }
  }, [data, form])

  const handleSubmit = (values: any) => {
    // Convert the purchasePlace date to the desired format
    const purchasePlaceDate = values.purchasePlace
      ? values.purchasePlace.toISOString()
      : null

    console.log('Form Submitted:', {
      ...values,
      purchasePlace: purchasePlaceDate,
    })

    message.success('Warranty claim submitted successfully!')
    form.resetFields()
  }

  return data ? (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: '100%', margin: 'auto' }}
    >
      <Title level={4}>Warranty Claim Form</Title>

      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Enter your full name" />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input placeholder="Enter your phone number" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Device Model"
        name="model"
        rules={[{ required: true, message: 'Please enter the device model' }]}
      >
        <Input placeholder="Enter the device model (e.g., iPhone 14)" />
      </Form.Item>

      <Form.Item
        label="IMEI/Serial Number"
        name="imei"
        rules={[
          { required: true, message: 'Please enter the IMEI or serial number' },
        ]}
      >
        <Input placeholder="Enter the IMEI or serial number" />
      </Form.Item>

      <Form.Item
        label="Date of Purchase"
        name="purchaseDate"
        rules={[
          { required: true, message: 'Please select the date of purchase' },
        ]}
      >
        <Input placeholder="Please enter the date of purchase " />
      </Form.Item>

      <Form.Item
        label="Place of Purchase Date"
        name="purchasePlace"
        rules={[
          {
            required: true,
            message: 'Please enter the place of purchase date',
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Issue Description"
        name="issue"
        rules={[{ required: true, message: 'Please describe the issue' }]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Describe the problem with your device"
        />
      </Form.Item>

      <Form.Item label="Previous Repairs (if any)" name="repairHistory">
        <Select placeholder="Select repair status" allowClear>
          <Option value="no">No prior repairs</Option>
          <Option value="yes">Yes, device was repaired before</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit Warranty Claim
        </Button>
      </Form.Item>
    </Form>
  ) : null
}

export default WarrantyForm
