'use client'

import {
  useGetAllShopQuery,
  useRecordAShopInfoMutation,
} from '@/redux/api/shop/shopApi'
import {
  AppstoreOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons'

import { ShopFormData } from '@/types'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Space,
  TimePicker,
  Typography,
} from 'antd'
import React from 'react'
import ShopList from './ShopList'

const { TextArea } = Input
const { RangePicker } = TimePicker
const { Text } = Typography

// Form input types, aligned with Prisma model

const ShopForm: React.FC = () => {
  const [form] = Form.useForm()
  const [recordAShopInfo] = useRecordAShopInfoMutation()
  const { data } = useGetAllShopQuery({ limit: 10 })

  const onFinish = async (values: ShopFormData) => {
    const formattedValues = {
      ...values,
      establishedDate: values.establishedDate
        ? values.establishedDate.format('DD MMM, YYYY') // Use desired format
        : null,
      hours: values.hours
        ? `${values.hours[0].format('h:mm A')} - ${values.hours[1].format(
            'h:mm A'
          )}`
        : null,
    }

    const res = await recordAShopInfo(formattedValues)
    if (res.data) {
      message.success('Shop record success')
      form.resetFields()
    }
  }

  return (
    <>
      {data?.shop?.length ? (
        <div>
          <ShopList />
          <Space
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '50vh',
              marginTop: '10px',
            }}
          >
            <Text type="danger" style={{ fontSize: '18px', fontWeight: 500 }}>
              Already exist a record.
            </Text>

            <Text>
              <ReloadOutlined /> Please update/Delete Record
            </Text>
          </Space>
        </div>
      ) : (
        <Form
          form={form}
          name="shopForm"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          style={{ maxWidth: '100%', margin: '0 auto', marginTop: '25px' }}
        >
          <Row gutter={[30, 30]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              {/* Shop Name */}
              <Form.Item
                label="Shop Name"
                name="shopName"
                rules={[
                  { required: true, message: 'Please enter the shop name!' },
                ]}
              >
                <Input
                  placeholder="Enter shop name"
                  prefix={<ShopOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Location/Address */}
              <Form.Item
                label="Location/Address"
                name="location"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the shop location!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter shop location/address"
                  prefix={<EnvironmentOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Owner/Manager */}
              <Form.Item
                label="Owner/Manager"
                name="owner"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the owner/manager name!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter owner/manager name"
                  prefix={<TeamOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Contact Information (Phone, Email, Website) */}
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter the phone number!' },
                ]}
              >
                <Input
                  placeholder="Enter phone number"
                  prefix={<PhoneOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter the email!' },
                  { type: 'email', message: 'The input is not a valid email!' },
                ]}
              >
                <Input
                  placeholder="Enter email"
                  prefix={<MailOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Website"
                name="website"
                rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
              >
                <Input
                  placeholder="Enter website URL"
                  prefix={<GlobalOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              {/* Operating Hours with AM/PM Format */}
              <Form.Item
                label="Operating Hours"
                name="hours"
                rules={[
                  { required: true, message: 'Please enter operating hours!' },
                ]}
              >
                <RangePicker
                  format="h:mm A"
                  use12Hours
                  placeholder={['Start Time', 'End Time']}
                  style={{ width: '100%' }}
                  // @ts-ignore
                  prefix={<ClockCircleOutlined />}
                />
              </Form.Item>

              {/* Type of Business */}
              <Form.Item
                label="Type of Business"
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Please specify the type of business!',
                  },
                ]}
              >
                <Input
                  placeholder="e.g., Retail, Wholesale, Service"
                  prefix={<AppstoreOutlined />}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Products/Services Offered */}
              <Form.Item
                label="Products/Services Offered"
                name="products"
                rules={[
                  {
                    required: true,
                    message: 'Please describe the products or services!',
                  },
                ]}
              >
                <TextArea
                  placeholder="Describe products or services offered"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Established Date */}
              <Form.Item
                label="Established Date"
                name="establishedDate"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the established date!',
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select established date"
                  format="DD MMM, YYYY"
                  style={{ width: '100%' }}
                  // @ts-ignore
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>

              {/* About Shop Details/Description */}
              <Form.Item
                label="About Shop"
                name="aboutShop"
                rules={[
                  {
                    required: true,
                    message: 'Please provide a description of the shop!',
                  },
                ]}
              >
                <TextArea
                  placeholder="Describe the shop in detail"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Record shop/company data
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  )
}

export default ShopForm
