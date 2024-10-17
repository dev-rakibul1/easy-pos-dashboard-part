'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleShopQuery,
  useUpdateShopRecordMutation,
} from '@/redux/api/shop/shopApi'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  TimePicker,
} from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// RangePicker component for time selection
const { RangePicker } = TimePicker
const { TextArea } = Input

type Params = {
  id: string
}

type IProps = {
  params: Params
}

const EditShopInfo = ({ params }: IProps) => {
  const [form] = Form.useForm()
  const { role } = getUserInfo() as ITokenObj
  const { id } = params
  const { data, isLoading } = useGetSingleShopQuery(id)
  const [updateShopRecord] = useUpdateShopRecordMutation()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        shopName: data?.shopName || '',
        location: data?.location || '',
        hours: data?.hours
          ? [
              dayjs(data.hours.split(' - ')[0], 'h:mm A'),
              dayjs(data.hours.split(' - ')[1], 'h:mm A'),
            ]
          : null,
        owner: data?.owner || '',
        phone: data?.phone || '',
        email: data?.email || '',
        website: data?.website || '',
        type: data?.type || '',
        products: data?.products || '',
        establishedDate: data.establishedDate
          ? dayjs(data.establishedDate)
          : null,
        aboutShop: data?.aboutShop || '',
      })
    }
  }, [data, form])

  const onFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      establishedDate: values.establishedDate
        ? values.establishedDate.format('DD MMM, YYYY')
        : null,
      hours: values.hours
        ? `${values.hours[0].format('h:mm A')} - ${values.hours[1].format(
            'h:mm A'
          )}`
        : null,
    }

    message.loading({ content: 'Updating shop...', key: 'updating' })
    try {
      const res = await updateShopRecord({ id, body: formattedValues })

      if (res.data) {
        message.success('Record update success!')
        router.push(`/${role}/shop-information`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  return (
    <ConfigProvider // Add ConfigProvider for dayjs support in Ant Design
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <div>
        <PosBreadcrumb
          items={[
            { label: `${role}`, link: `/${role}` },
            { label: 'Update record', link: `/${role}/shop-information` },
            { label: 'Update', link: '' },
          ]}
        />

        <ActionBar title="Update shop/company details"></ActionBar>

        {/* Show the form only when data is available */}
        {!isLoading && (
          <Form
            form={form}
            name="shopForm"
            layout="vertical"
            onFinish={onFinish}
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
                  />
                </Form.Item>

                {/* Contact Information (Phone, Email, Website) */}
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the phone number!',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter phone number"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter the email!' },
                    {
                      type: 'email',
                      message: 'The input is not a valid email!',
                    },
                  ]}
                >
                  <Input placeholder="Enter email" prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                  label="Website"
                  name="website"
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL!' },
                  ]}
                >
                  <Input
                    placeholder="Enter website URL"
                    prefix={<GlobalOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                {/* Operating Hours */}
                <Form.Item
                  label="Operating Hours"
                  name="hours"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter operating hours!',
                    },
                  ]}
                >
                  <RangePicker
                    format="h:mm A"
                    use12Hours
                    placeholder={['Start Time', 'End Time']}
                    style={{ width: '100%' }}
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
                  <TextArea placeholder="Describe products or services offered" />
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
                    //   prefix={<CalendarOutlined />}
                  />
                </Form.Item>

                {/* About Shop */}
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
                  <TextArea placeholder="Describe the shop in detail" />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                Update shop/company data
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </ConfigProvider>
  )
}

export default EditShopInfo
