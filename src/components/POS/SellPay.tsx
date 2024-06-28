import { payments } from '@/constants/global'
import { Button, Col, Form, Input, Row, Select, message } from 'antd'
import { Dispatch, SetStateAction } from 'react'
import { IProductData } from './Pos'

const { Item } = Form

export interface ISellPayISellPay {
  amount: number
  paymentMethod: string
}

interface ISellPayProps {
  setPayAmountInfo: Dispatch<SetStateAction<ISellPayISellPay>>
  dueBalance: number
  sellPayloads: IProductData[]
}

const PaySell: React.FC<ISellPayProps> = ({
  setPayAmountInfo,
  dueBalance,
  sellPayloads,
}) => {
  const [form] = Form.useForm<ISellPayISellPay>()

  const handlePayChange = (
    changedValues: Partial<ISellPayISellPay>,
    allValues: ISellPayISellPay
  ) => {
    setPayAmountInfo(allValues)
  }

  const handleFinish = (values: ISellPayISellPay) => {
    if (dueBalance < values.amount) {
      message.warning('Pay balance too long.')
      return
    }
    const sellingInformation = {
      ...values,
      sellPayloads,
    }
    console.log(sellingInformation)
    console.log(sellPayloads)

    form.resetFields()
  }

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <Form
      form={form}
      name="name_email_form"
      onValuesChange={handlePayChange}
      onFinish={handleFinish}
      layout="vertical"
      style={{ marginTop: '15px' }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={20} md={8} lg={8}>
          <Item
            name="amount"
            rules={[
              {
                required: true,
                message: 'Please enter your amount',
              },
              {
                max: 50,
                message: 'Amount cannot exceed 50 characters',
              },
            ]}
          >
            <Input placeholder="Enter your amount" type="number" />
          </Item>
        </Col>
        <Col xs={24} sm={20} md={8} lg={8}>
          <Item
            name="paymentMethod"
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
            />
          </Item>
        </Col>
        <Col xs={24} sm={24} md={5} lg={5}>
          <Item>
            <Button type="primary" htmlType="submit">
              Sell product
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  )
}

export default PaySell
