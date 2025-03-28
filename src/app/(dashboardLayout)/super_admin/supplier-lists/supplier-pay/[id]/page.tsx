'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import {
  supplierAndCustomerCoverStyle,
  supplierAndCustomerStyle,
} from '@/components/styles/style'
import { currencyName, payments } from '@/constants/global'

import { useCreatePayInSupplierMutation } from '@/redux/api/payInSupplier/payInSupplierApi'
import { useGetSinglePurchaseGroupQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetSingleSupplierSellQuery } from '@/redux/api/supplierSells/supplierSellApi'
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

const { Title, Text } = Typography

interface Params {
  id: string
}

interface Props {
  params: Params
}

const SupplierPayPage: React.FC<Props> = ({ params }) => {
  const { role } = getUserInfo() as any
  const paramsId = params.id
  const { data, isLoading } = useGetSingleSupplierSellQuery(paramsId, {
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })
  const { data: purchaseGroup } = useGetSinglePurchaseGroupQuery(paramsId, {
    pollingInterval: 15000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  })
  const [createPayInSupplier, { isLoading: PayCreateLoading }] =
    useCreatePayInSupplierMutation()

  const [form] = Form.useForm()
  const [activeTabKey, setActiveTabKey] = useState<string>('details')

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        previousDue: data.totalDue,
        totalPay: data.totalPay,
        totalSellAmounts: data.totalSellAmounts,
        SupplierSellId: data?.id,
        purchaseGroupId: purchaseGroup?.id,
      })
    }
  }, [data, form, purchaseGroup?.id])

  const onFinish = async (values: any) => {
    const convertNumberValue = Number(values?.pay)
    if (convertNumberValue > data?.totalDue) {
      message.warning('Your amount is too long for supplier amount.')
      return
    } else {
      const payloads = {
        supplierSellId: data?.id,
        purchaseGroupId: purchaseGroup?.id,
        payAmount: convertNumberValue,
        paymentType: values?.paymentMethod,
      }

      const res = await createPayInSupplier(payloads)

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
      tab: 'Supplier Details',
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
      <Card style={{ marginTop: '50px' }}>
        <Title level={2}>
          <Text type="success" style={{ fontSize: '20px' }}>
            {data?.supplier?.firstName && data?.supplier?.firstName}{' '}
            {data?.supplier?.middleName && data?.supplier?.middleName}{' '}
            {data?.supplier?.lastName && data?.supplier?.lastName}
            {!data?.supplier?.firstName && !data?.supplier?.lastName && 'N/A'}
          </Text>
        </Title>
        <Descriptions bordered column={1} style={{ marginTop: '15px' }}>
          <Descriptions.Item label="Total Purchase">
            <Text type="warning">
              {currencyName}{' '}
              {data?.totalSellAmounts ? data?.totalSellAmounts : 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Previous Due">
            <Text type="danger">
              {data?.totalSellAmounts
                ? data?.totalSellAmounts <= data?.totalPay
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
              {data?.supplier?.email ? data?.supplier?.email : 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <Text type="secondary">
              <PhoneOutlined />{' '}
              {data?.supplier?.phoneNo ? data?.supplier?.phoneNo : 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <Text type="secondary">
              <HomeOutlined />{' '}
              {data?.supplier?.presentAddress
                ? data?.supplier?.presentAddress
                : 'N/A'}
            </Text>
          </Descriptions.Item>
        </Descriptions>

        {data?.totalSellAmounts <= data?.totalPay && (
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
              color: '#ddd',
            }}
          >
            Paid
          </h1>
        )}
      </Card>
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
            label: `Supplier List`,
            link: `/${role}/supplier-lists/`,
          },
          {
            label: `Payment`,
            // @ts-ignore
            link: `/${role}/supplier-lists/supplier-pay/${params?.id}`,
          },
        ]}
      />
      <Row justify="center" style={{ padding: '20px' }}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card
            style={{ padding: '15px', position: 'relative' }}
            cover={
              <Image
                alt="supplier"
                width={120}
                height={120}
                // layout="responsive"
                src={
                  data?.supplier?.profileImage
                    ? `${data?.supplier?.profileImage}`
                    : placeholderImage
                }
                style={supplierAndCustomerCoverStyle}
              />
            }
            title="Supplier Information"
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
                  data?.supplier?.profileImage
                    ? `${data?.supplier?.profileImage}`
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

export default SupplierPayPage
