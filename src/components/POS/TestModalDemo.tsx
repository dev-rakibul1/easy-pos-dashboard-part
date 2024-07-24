import { Button, Form, Input, Modal } from 'antd'
import { useState } from 'react'

const TestModalFormDemo = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const onFinish = (values: { name: string; email: string; phone: string }) => {
    console.log('Success:', values)
    setIsModalVisible(true)

    // Store the phone number
    const phoneNumber = values.phone

    // Reset all fields
    form.resetFields()

    // Set the phone number back
    form.setFieldsValue({ phone: phoneNumber })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  return (
    <div>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: 'Please input your phone number!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Form Submitted"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>Your form has been submitted successfully!</p>
      </Modal>
    </div>
  )
}

export default TestModalFormDemo
