'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import { useCreatePayInSupplierMutation } from '@/redux/api/payInSupplier/payInSupplierApi'
import { useGetSinglePurchaseGroupQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetSingleSupplierSellQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { getUserInfo } from '@/services/auth.services'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  message,
} from 'antd'
import React, { useEffect, useState } from 'react'

const { Title } = Typography

const SupplierPay = ({ params }: any) => {
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
      key: 'pay',
      tab: 'Pay',
    },
  ]

  const contentList: Record<string, React.ReactNode> = {
    details: (
      <>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>
              {data?.supplier?.firstName}{' '}
              {data?.supplier?.middleName && data?.supplier?.middleName}{' '}
              {data?.supplier?.lastName}
            </Title>
            <p>
              <b>Email:</b> {data?.supplier?.email}
            </p>
            <p>
              <b>Phone:</b> {data?.supplier?.phoneNo}
            </p>
            <p>
              <b>Address:</b> {data?.supplier?.presentAddress}
            </p>
            <p>
              <b>Total sell:</b> {data?.totalSellAmounts}
            </p>
            <p>
              <b>Previous Due:</b>{' '}
              {data?.totalSellAmounts <= data?.totalPay
                ? 'Paid'
                : data?.totalDue}
            </p>
            <p>
              <b>Total Pay:</b> {data?.totalPay}
            </p>
          </Col>
        </Row>
      </>
    ),
    pay: (
      <Form
        form={form}
        name="supplier_pay"
        onFinish={onFinish}
        layout="vertical"
        disabled={data?.totalSellAmounts <= data?.totalPay}
      >
        <Form.Item
          name="pay"
          label="Pay"
          rules={[{ required: true, message: 'Please input the pay amount!' }]}
        >
          <Input placeholder="Enter pay amount" size="large" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={data?.totalSellAmounts <= data?.totalPay}
          >
            {data?.totalSellAmounts <= data?.totalPay ? 'Paid' : 'Pay'}
          </Button>
        </Form.Item>
      </Form>
    ),
  }

  const onTabChange = (key: string) => {
    setActiveTabKey(key)
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Supplier list`,
            link: `/${role}/supplier-lists/`,
          },
          {
            label: `Pay`,
            // @ts-ignore
            link: `/${role}/supplier-lists/supplier-pay/${params?.id}`,
          },
        ]}
      />
      <Row justify="center" style={{ padding: '20px' }}>
        <Col span={10}>
          <Card
            style={{ padding: '15px' }}
            cover={
              <img
                alt="Supplier"
                src={
                  data?.supplier?.profileImage
                    ? `http://localhost:7000${data?.supplier?.profileImage}`
                    : 'https://via.placeholder.com/300'
                }
                style={{ maxWidth: '100%', marginTop: '15px' }}
              />
            }
            title="Supplier Information"
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            {contentList[activeTabKey]}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SupplierPay
