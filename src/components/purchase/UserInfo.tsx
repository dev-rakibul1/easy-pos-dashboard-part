import { currencyName, payments } from '@/constants/global'
import { useAddANewPurchaseMutation } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { useGetSupplierSellsBySupplierAndUserQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { ISupplierSells } from '@/types'
import numberConvert from '@/utils/numberConvert'
import { UserOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from 'antd'
import millify from 'millify'
import { useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import DownloadModal from '../downloadModal/DownloadModal'
import { userInfoSupplierPay, userInfoSupplierSpin } from '../styles/style'
import { IFormValues } from './Purchase'

const { Item } = Form
const { Text, Title } = Typography

const UserInfo = ({
  supplierId,
  userData,
  formValues,
  setFormValues,
  handlePayChange,
  payloads,
  setPayloads,
  componentRef
}: any) => {
  const { uniqueId: id } = getUserInfo() as any
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { data, isLoading: isUserLoading } = useGetSingleUserQuery(id)
  const { data: supplier } =
    useGetSingleSupplierQuery(supplierId)
  const userId = data?.id

  // Print
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current,
  })

  const showDownloadModal = () => {
    setIsModalVisible(true)
  }

  const { data: userSellInfo, isLoading } =
    useGetSupplierSellsBySupplierAndUserQuery(supplierId, userId)

  const totalQuantity = userSellInfo?.reduce(
    (acc: number, item: ISupplierSells) => acc + item.quantity,
    0
  )

  const totalPrice = userSellInfo?.reduce(
    (acc: number, item: ISupplierSells) => acc + item.totalSellAmounts,
    0
  )
  const dueAmount = userSellInfo?.reduce(
    (acc: number, item: ISupplierSells) => acc + item.totalDue,
    0
  )
  const totalPay = userSellInfo?.reduce(
    (acc: number, item: ISupplierSells) => acc + item.totalPay,
    0
  )

  const sellInformation = {
    totalQuantity,
    totalPrice,
    totalPay,
    dueAmount,
  }

  console.log(payloads)

  // ----------FROM--------
  const [form] = Form.useForm()
  const [addANewPurchase] = useAddANewPurchaseMutation()

  const handleFinish = async (values: IFormValues) => {
    // @ts-ignore
    payloads.supplierPayment.totalPay = parseFloat(values.amount) || 0
    payloads.supplierPayment.paymentType = values?.paymentMethod
    message.loading({ content: 'Creating purchase...', key: 'creating' })

    
    message.success('Sell successfully!')
    showDownloadModal()

    try {
      const res = await addANewPurchase(payloads).unwrap()
      // console.log(res)

      if (res) {
        message.success('Purchase successfully!')

        form.resetFields()
        setPayloads({})
      } else {
        message.error('Purchase fail!')
      }
    } catch (error: any) {
      message.error('Purchase fail!')
    } finally {
      message.destroy('creating')
    }
  }

  // console.log(payloads)

  const onSearch = (value: string) => {
    // console.log('Search:', value)
  }

  const handleDownloadOk = () => {
    setIsModalVisible(false)
    form.resetFields()
    // setSelectCustomer('')
    // setSellPayloads([])
  }

  const handleDownloadCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    // setSellPayloads([])
    // setSelectCustomer('')
  }


  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <div
      style={{ border: '1px solid #ddd', padding: '15px', marginTop: '10px' }}
    >
      <DownloadModal
        title="Download purchase report"
        isModalVisible={isModalVisible}
        handleDownloadOk={handleDownloadOk}
        handleDownloadCancel={handleDownloadCancel}
        handlePrint={handlePrint}
        body="Do you want to download the purchase report?"
      />

      <Row gutter={16} style={{ height: '100%' }}>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          style={{ height: '100%', maxHeight: '100%' }}
        >
          {isLoading ? (
            <div>
              <Spin size="small" />
            </div>
          ) : (
            <div>
              <Text strong>Seller information</Text>
              <Card style={{ textAlign: 'center', borderRadius: 10 }}>
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={
                    supplier?.profileImage
                      ? `http://localhost:7000${supplier?.profileImage}`
                      : 'https://via.placeholder.com/300'
                  }
                  style={{ marginBottom: 16 }}
                />
                <Title level={4} style={{ marginBottom: 0 }}>
                  {`${supplier?.firstName} ${
                    supplier?.middleName ? supplier?.middleName : ''
                  } ${supplier?.lastName}`}
                </Title>
                <Row justify="space-around" style={{ marginTop: 16 }}>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>{numberConvert(totalQuantity)}</Text>
                    <Text>Product sell</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {sellInformation?.totalPrice
                        ? `${currencyName} ${millify(
                            sellInformation?.totalPrice,
                            {
                              units: ['', 'k', 'M', 'B', 'T'],
                              space: true,
                            }
                          )}`
                        : 0}
                    </Text>
                    <Text>Total Sells</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {sellInformation?.dueAmount
                        ? `${currencyName} ${millify(
                            sellInformation?.dueAmount,
                            {
                              units: ['', 'k', 'M', 'B', 'T'],
                              space: true,
                            }
                          )}`
                        : 0}
                    </Text>
                    <Text>Total Due</Text>
                  </Col>
                </Row>
              </Card>
            </div>
          )}
        </Col>

        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          style={{ height: '100%', maxHeight: '100%' }}
        >
          {isUserLoading ? (
            <div>
              <Spin size="small" />
            </div>
          ) : (
            <div>
              <Text strong>Buyer information</Text>
              <Card style={{ textAlign: 'center', borderRadius: 10 }}>
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={
                    data?.profileImage
                      ? `http://localhost:7000${data?.profileImage}`
                      : 'https://via.placeholder.com/300'
                  }
                  style={{ marginBottom: 16 }}
                />
                <Title level={4} style={{ marginBottom: 0 }}>
                  {`${data?.firstName} ${data?.middleName} ${data?.lastName}`}
                </Title>
                <Row justify="space-around" style={{ marginTop: 16 }}>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {sellInformation?.totalPay
                        ? `${currencyName} ${millify(
                            sellInformation?.totalPay,
                            {
                              units: ['', 'k', 'M', 'B', 'T'],
                              space: true,
                            }
                          )}`
                        : 0}
                    </Text>
                    <Text>Total Pay</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {sellInformation?.totalPrice
                        ? `${currencyName} ${millify(
                            sellInformation?.totalPrice,
                            {
                              units: ['', 'k', 'M', 'B', 'T'],
                              space: true,
                            }
                          )}`
                        : 0}
                    </Text>
                    <Text>Total buy</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {sellInformation?.dueAmount
                        ? `${currencyName} ${millify(
                            sellInformation?.dueAmount,
                            {
                              units: ['', 'k', 'M', 'B', 'T'],
                              space: true,
                            }
                          )}`
                        : 0}
                    </Text>
                    <Text>Total Due</Text>
                  </Col>
                </Row>
                {payloads?.purchase?.length ? (
                  <Form
                    form={form}
                    name="name_email_form"
                    initialValues={formValues}
                    onValuesChange={handlePayChange}
                    onFinish={handleFinish}
                    layout="vertical"
                    style={{ marginTop: '15px' }}
                  >
                    <Row gutter={16} style={userInfoSupplierSpin}>
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
                              message: 'Name cannot exceed 50 characters',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter your amount"
                            type="number"
                          />
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
                            onSearch={onSearch}
                            options={payments}
                            filterOption={filterOption}
                            style={{ width: '100%' }}
                          />
                        </Item>
                      </Col>

                      <Col xs={24} sm={24} md={5} lg={5}>
                        <Item>
                          <Button type="primary" htmlType="submit">
                            Pay & purchase
                          </Button>
                        </Item>
                      </Col>
                    </Row>
                  </Form>
                ) : null}
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default UserInfo
