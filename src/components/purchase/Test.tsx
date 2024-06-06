import { Button, Form, Input, Select } from 'antd'
import { useState } from 'react'

const { Item } = Form

const payments = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

interface FormValues {
  name: string
  email: string
  paymentMethod: string
}

const NameEmailForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    paymentMethod: '',
  })

  const [form] = Form.useForm()

  const handleChange = (
    changedValues: Partial<FormValues>,
    allValues: FormValues
  ) => {
    setFormValues(allValues)
    console.log('Form values:', allValues)
  }

  const handleFinish = (values: FormValues) => {
    console.log('Form submitted:', values)
  }

  const onSearch = (value: string) => {
    console.log('Search:', value)
  }

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <Form
      form={form}
      name="name_email_form"
      initialValues={formValues}
      onValuesChange={handleChange}
      onFinish={handleFinish}
      layout="vertical"
    >
      <Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Please enter your name' },
          { max: 50, message: 'Name cannot exceed 50 characters' },
        ]}
      >
        <Input placeholder="Enter your name" />
      </Item>
      <Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Item>
      <Item
        name="paymentMethod"
        label="Payment Method"
        rules={[{ required: true, message: 'Please select a payment method' }]}
      >
        <Select
          showSearch
          placeholder="Select a payment"
          optionFilterProp="children"
          onSearch={onSearch}
          options={payments}
          filterOption={filterOption}
          style={{ width: '100%' }}
        />
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Item>
    </Form>
  )
}

export default NameEmailForm
