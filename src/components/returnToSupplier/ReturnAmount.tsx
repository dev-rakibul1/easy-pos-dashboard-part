import { payments } from '@/constants/global'
import { useAddANewSellsMutation } from '@/redux/api/sells/sellsApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, Form, Input, Row, Select, message } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import { IProductData, ISellVariant } from './Return'

const { Item } = Form

export interface ISellPayISellPay {
  amount: number
  paymentMethod: string
}

interface ISellPayProps {
  setPayAmountInfo: Dispatch<SetStateAction<ISellPayISellPay>>
  dueBalance: number
  returnPayloads: IProductData[]
  setReturnPayloads: any
}

const ReturnAmounts: React.FC<ISellPayProps> = ({
  setPayAmountInfo,
  dueBalance,
  returnPayloads,
  setReturnPayloads,
}) => {
  const { uniqueId } = getUserInfo() as any
  const [form] = Form.useForm<ISellPayISellPay>()
  const [concatVariants, setConcatVariants] = useState<ISellVariant[]>([])
  const { data: userData } = useGetSingleUserQuery(uniqueId)
  const [addANewSells] = useAddANewSellsMutation()

  const handlePayChange = (
    changedValues: Partial<ISellPayISellPay>,
    allValues: ISellPayISellPay
  ) => {
    setPayAmountInfo(allValues)
  }

  const handleFinish = async (values: ISellPayISellPay) => {
    if (dueBalance < values.amount) {
      message.warning('Pay balance too long.')
      return
    }

    const supplierId = returnPayloads?.find(id => id.supplierId)
    const productId = returnPayloads?.find(id => id.productId)

    // Customer payment
    // @ts-ignore
    values.amount = parseFloat(values?.amount ? values?.amount : 0) as number
    const supplierReturn = {
      totalPay: values?.amount,
      customerId: supplierId?.supplierId,
      productId: productId?.productId,
      userId: userData?.id,
    }

    // sell variants
    const variantsData: ISellVariant[] =
      returnPayloads?.flatMap(variant => variant?.variants || []) || []
    setConcatVariants(prevConcatVariants => [
      ...prevConcatVariants,
      ...variantsData,
    ])

    // Selling information
    const returnsInfo = returnPayloads.map(ret => {
      return {
        totalSellPrice: ret?.totalPrice,

        productName: ret?.productName,
        modelName: ret?.modelName,
        supplierName: ret?.supplierName,
        quantity: ret?.quantity,

        supplierId: ret?.supplierId,
        productId: ret?.productId,
        variantId: ret?.variantId,
        userId: userData?.id,
      }
    })

    const finalSellInformation = {
      supplierReturn: supplierReturn,
      variants: variantsData,
      payloads: returnsInfo,
    }

    message.loading({ content: 'Return...', key: 'creating' })

    console.log(finalSellInformation)

    // try {
    //   const res = await addANewSells(finalSellInformation)

    //   if (res?.data?.count) {
    //     message.success('Sell successfully!')

    //     form.resetFields()
    //     setSellPayloads([])
    //   } else {
    //     message.error('Sell fail!')
    //   }
    // } catch (error: any) {
    //   message.error('Sell fail!')
    // } finally {
    //   message.destroy('creating')
    // }

    // form.resetFields()
    // setSellPayloads([])
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

export default ReturnAmounts
