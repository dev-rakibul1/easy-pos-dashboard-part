'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import {
  supplierAndCustomerCoverStyle,
  supplierAndCustomerStyle,
} from '@/components/styles/style'
import { currencyName, payments } from '@/constants/global'
import { useGetSingleCustomerPurchaseQuery } from '@/redux/api/customerPurchase/customerPurchaseApi'
import { useGetSingleSellGroupQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { getUserInfo } from '@/services/auth.services'
import { placeholderImage } from '@/utils/placeholderImage/placeholderImage'
import { HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useCreateCustomerPayInUserMutation } from '../../../../../../redux/api/customerPayInUserApi/customerPayInUserApi'
const { Item } = Form

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
        paymentType: values.paymentMethod,
      }

      // console.log(payloads)

      const res = await createCustomerPayInUser(payloads)

      if (PayCreateLoading) {
        return (
          <Spin
            size="small"
            style={{ display: 'block', margin: '100px auto' }}
          />
        )
      }
      if (res?.data) {
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

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

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
                {currencyName}{' '}
                {data?.totalPurchaseAmounts
                  ? data?.totalPurchaseAmounts
                  : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Previous Due">
              <Text type="danger">
                {data?.totalPurchaseAmounts
                  ? data?.totalPurchaseAmounts <= data?.totalPay
                    ? 'Paid'
                    : `${currencyName} ${data?.totalDue}`
                  : 'N/A'}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Total Pay">
              <Text type="success">
                {currencyName} {data?.totalPay ? data?.totalPay : 'N/A'}
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

          {data?.totalPurchaseAmounts <= data?.totalPay && (
            <h1
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
                fontSize: '10vw',
                zIndex: '0',
                margin: '0',
                color: '#000',
                opacity: '.1',
              }}
            >
              Paid
            </h1>
          )}
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
        <Row gutter={16}>
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
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="paymentMethod"
              label="Payment Method"
              rules={[
                {
                  required: true,
                  message: 'Please select a payment method',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a payment"
                optionFilterProp="children"
                options={payments}
                filterOption={filterOption}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={data?.totalPurchaseAmounts <= data?.totalPay}
                block
              >
                {data?.totalPurchaseAmounts <= data?.totalPay ? 'Paid' : 'Pay'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
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
              <Image
                alt="customer"
                width={120}
                height={120}
                // layout="responsive"
                src={
                  data?.customer?.profileImage
                    ? `${data?.customer?.profileImage}`
                    : placeholderImage
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
              <Image
                width={120}
                height={120}
                // layout="responsive"
                src={
                  data?.customer?.profileImage
                    ? `${data?.customer?.profileImage}`
                    : placeholderImage
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
