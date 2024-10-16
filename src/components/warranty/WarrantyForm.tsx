import { useAddANewWarrantyMutation } from '@/redux/api/warranty/warrantyApi'
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
  setImei: (item: string) => void
}

const WarrantyForm = ({ data, setImei }: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [addANewWarranty] = useAddANewWarrantyMutation()

  // Use useEffect to set form values
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        phone: data.customer.phoneNo,
        email: data.customer.email,
        model: `${data.productName} - ${data.modelName}`,
        imei: data.customerPurchaseVariants.imeiNumber,
        purchaseDate: data.createdAt,
        issueSubmitDate: dayjs(),
        purchasePlace: 'Track For Creativity LLC',
      })
    }
  }, [data, form])

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      const formattedIssueSubmitDate = values.issueSubmitDate
        ? dayjs(values.issueSubmitDate).toISOString() // Ensure conversion
        : null

      const warrantyInfo = {
        ...values,
        issueSubmitDate: formattedIssueSubmitDate,
      }

      const res = await addANewWarranty(warrantyInfo)

      if (res.data) {
        message.success('Warranty claim submitted successfully!')
        form.resetFields()
        setImei('')
      }

      console.log('Form res:', res)
      console.log('Form Submitted:', warrantyInfo)
    } catch (error) {
      message.error('Error submitting the form.')
    }
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
        <Input placeholder="Date of purchase" />
      </Form.Item>

      <Form.Item
        label="Purchase Place"
        name="purchasePlace"
        rules={[{ required: true, message: 'Name of purchase place' }]}
      >
        <Input placeholder="Enter the purchase place" />
      </Form.Item>

      <Form.Item
        label="Issue Submit Date"
        name="issueSubmitDate"
        rules={[
          { required: true, message: 'Please enter the issue submit date' },
        ]}
      >
        <DatePicker style={{ width: '100%' }} showTime />
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
