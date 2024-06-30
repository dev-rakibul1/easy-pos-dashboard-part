'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import {
  supplierAndCustomerCoverStyle,
  supplierAndCustomerStyle,
} from '@/components/styles/style'
import { useGetSingleCustomerPurchaseQuery } from '@/redux/api/customerPurchase/customerPurchaseApi'
import { useGetSingleSellGroupQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { getUserInfo } from '@/services/auth.services'
import {
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  message,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useCreateCustomerPayInUserMutation } from '../../../../../../redux/api/customerPayInUserApi/customerPayInUserApi'

const { Title, Text } = Typography

interface Params {
  id: string
}

interface Props {
  params: Params
}

const CustomerPayPage: React.FC<Props> = ({ params }) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id
  const { data, isLoading } = useGetSingleCustomerPurchaseQuery(paramsId, {
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })

  const { data: sellGroup } = useGetSingleSellGroupQuery(paramsId, {
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })
  const [createCustomerPayInUser, { isLoading: PayCreateLoading }] =
    useCreateCustomerPayInUserMutation()

  const [form] = Form.useForm()
  const [activeTabKey, setActiveTabKey] = useState<string>('details')

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        previousDue: data.totalDue,
        totalPay: data.totalPay,
        totalPurchaseAmounts: data.totalPurchaseAmounts,
        SupplierSellId: data?.id,
        purchaseGroupId: sellGroup?.id,
      })
    }
  }, [data, form, sellGroup?.id])

  const onFinish = async (values: any) => {
    const convertNumberValue = Number(values?.pay)
    if (convertNumberValue > data?.totalDue) {
      message.warning('Your amount is too long for purchase amount.')
      return
    } else {
      const payloads = {
        customerPurchaseId: data?.id,
        sellGroupId: sellGroup?.id,
        payAmount: convertNumberValue,
      }

      console.log(payloads)

      const res = await createCustomerPayInUser(payloads)

      if (PayCreateLoading) {
        return (
          <Spin
            size="small"
            style={{ display: 'block', margin: '100px auto' }}
          />
        )
      }
      if (res.data) {
        message.success('Payment done')
        form.resetFields()
      } else {
        message.error('Payment fail!')
      }
    }
  }

  if (isLoading) {
    return (
      <Spin size="small" style={{ display: 'block', margin: '100px auto' }} />
    )
  }

  const tabList = [
    {
      key: 'details',
      tab: 'Customer Details',
    },
    {
      key: 'Payment',
      tab: 'Payment',
    },
  ]

  const contentList: Record<string, React.ReactNode> = {
    details: (
      <>
        <Card style={{ marginTop: '50px' }}>
          <Title level={2}>
            <Text type="success" style={{ fontSize: '20px' }}>
              {data?.customer?.firstName && data?.customer?.firstName}{' '}
              {data?.customer?.middleName && data?.customer?.middleName}{' '}
              {data?.customer?.lastName && data?.customer?.lastName}
              {!data?.customer?.firstName && !data?.customer?.lastName && 'N/A'}
            </Text>
          </Title>
          <Descriptions bordered column={1} style={{ marginTop: '15px' }}>
            <Descriptions.Item label="Total Purchase">
              <Text type="warning">
                <DollarCircleOutlined />{' '}
                {data?.totalPurchaseAmounts
                  ? data?.totalPurchaseAmounts
                  : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Previous Due">
              <Text type="danger">
                <ExclamationCircleOutlined />{' '}
                {data?.totalPurchaseAmounts
                  ? data?.totalPurchaseAmounts <= data?.totalPay
                    ? 'Paid'
                    : data?.totalDue
                  : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Total Pay">
              <Text type="success">
                <DollarCircleOutlined />{' '}
                {data?.totalPay ? data?.totalPay : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Text type="secondary">
                <MailOutlined />{' '}
                {data?.customer?.email ? data?.customer?.email : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <Text type="secondary">
                <PhoneOutlined />{' '}
                {data?.customer?.phoneNo ? data?.customer?.phoneNo : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              <Text type="secondary">
                <HomeOutlined />{' '}
                {data?.customer?.presentAddress
                  ? data?.customer?.presentAddress
                  : 'N/A'}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </>
    ),
    Payment: (
      <Form
        form={form}
        name="customer_pay"
        onFinish={onFinish}
        layout="vertical"
        disabled={data?.totalPurchaseAmounts <= data?.totalPay}
        style={{ marginTop: '50px' }}
      >
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="pay"
            label="Pay"
            rules={[
              { required: true, message: 'Please input the pay amount!' },
            ]}
          >
            <Input placeholder="Enter pay amount" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={data?.totalPurchaseAmounts <= data?.totalPay}
            >
              {data?.totalPurchaseAmounts <= data?.totalPay ? 'Paid' : 'Pay'}
            </Button>
          </Form.Item>
        </Col>
      </Form>
    ),
  }

  const onTabChange = (key: string) => {
    setActiveTabKey(key)
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Customer list`,
            link: `/${role}/customers-list/`,
          },
          {
            label: `Payment`,
            // @ts-ignore
            link: `/${role}/customers-list/customer-pay/${params?.id}`,
          },
        ]}
      />
      <Row justify="center" style={{ padding: '20px' }}>
        <Col span={16}>
          <Card
            style={{ padding: '15px', position: 'relative' }}
            cover={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="customer"
                src={
                  data?.customer?.profileImage
                    ? `http://localhost:7000${data?.customer?.profileImage}`
                    : 'https://via.placeholder.com/300'
                }
                style={supplierAndCustomerCoverStyle}
              />
            }
            title="Customer Information"
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            <div style={{ position: 'relative', zIndex: '10' }}>
              <img
                src={
                  data?.customer?.profileImage
                    ? `http://localhost:7000${data?.customer?.profileImage}`
                    : 'https://via.placeholder.com/300'
                }
                alt=""
                style={supplierAndCustomerStyle}
              />
            </div>

            {contentList[activeTabKey]}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CustomerPayPage
