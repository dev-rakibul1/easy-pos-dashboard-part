import { payments } from '@/constants/global'
import { useAddANewSellsMutation } from '@/redux/api/sells/sellsApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, Form, Input, message, Row, Select } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import DownloadModal from '../downloadModal/DownloadModal'
import { IProductData, ISellVariant } from './Pos'

const { Item } = Form

export interface ISellPayISellPay {
  amount: number
  paymentMethod: string
}

interface ISellPayProps {
  setPayAmountInfo: Dispatch<SetStateAction<ISellPayISellPay>>
  dueBalance: number
  sellPayloads: IProductData[]
  setSellPayloads: any
  componentRef: any
  setSelectCustomer: any
}

const PaySell: React.FC<ISellPayProps> = ({
  setPayAmountInfo,
  dueBalance,
  sellPayloads,
  setSellPayloads,
  componentRef,
  setSelectCustomer,
}) => {
  const { uniqueId } = getUserInfo() as any
  const [form] = Form.useForm<ISellPayISellPay>()
  const [concatVariants, setConcatVariants] = useState<ISellVariant[]>([])
  const { data: userData } = useGetSingleUserQuery(uniqueId)
  const [addANewSells] = useAddANewSellsMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  const handlePayChange = (
    changedValues: Partial<ISellPayISellPay>,
    allValues: ISellPayISellPay
  ) => {
    setPayAmountInfo(allValues)
  }

  const showDownloadModal = () => {
    setIsModalVisible(true)
  }

  const handleFinish = async (values: ISellPayISellPay) => {
    if (dueBalance < values.amount) {
      message.warning('Pay balance too long.')
      return
    }

    const customerId = sellPayloads?.find(id => id.customerId)
    const productId = sellPayloads?.find(id => id.productId)

    // Customer payment
    // @ts-ignore
    values.amount = parseFloat(values?.amount ? values?.amount : 0) as number
    const customerPayInUser = {
      totalPay: values?.amount,
      paymentType: values?.paymentMethod,
      customerId: customerId?.customerId,
      productId: productId?.productId,
      userId: userData?.id,
    }

    // sell variants
    const variantsData: ISellVariant[] =
      sellPayloads?.flatMap(variant => variant?.variants || []) || []
    setConcatVariants(prevConcatVariants => [
      ...prevConcatVariants,
      ...variantsData,
    ])

    // Selling information
    const sellsInfo = sellPayloads.map(sell => {
      return {
        vats: sell?.vats,
        discounts: sell?.discounts,

        sellingPrice: sell?.sellingPrice,
        purchaseRate: sell?.purchaseRate,
        totalSellPrice: sell?.totalPrice,

        productName: sell?.productName,
        modelName: sell?.modelName,
        customerName: sell?.customerName,
        quantity: sell?.quantity,

        customerId: sell?.customerId,
        productId: sell?.productId,
        variantId: sell?.variantId,
        userId: userData?.id,
      }
    })

    const finalSellInformation = {
      customerPayInUser: customerPayInUser,
      variants: variantsData,
      sells: sellsInfo,
    }

    message.loading({ content: 'Selling...', key: 'creating' })
    try {
      const res = await addANewSells(finalSellInformation)

      if (res?.data?.count) {
        message.success('Sell successfully!')
        showDownloadModal()
      } else {
        message.error('Sell fail!')
      }
    } catch (error: any) {
      message.error('Sell fail!')
    } finally {
      message.destroy('creating')
    }
  }

  const handleDownloadOk = () => {
    setIsModalVisible(false)
    form.resetFields()
    setSelectCustomer('')
    setSellPayloads([])
  }

  const handleDownloadCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setSellPayloads([])
    setSelectCustomer('')
  }

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <>
      <DownloadModal
        title="Download sales report"
        isModalVisible={isModalVisible}
        handleDownloadOk={handleDownloadOk}
        handleDownloadCancel={handleDownloadCancel}
        handlePrint={handlePrint}
        body="Do you want to download the sales report?"
      />
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
    </>
  )
}

export default PaySell
