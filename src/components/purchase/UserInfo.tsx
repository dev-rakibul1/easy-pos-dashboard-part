import { payments } from '@/constants/global'
import {
  useAddANewPurchaseMutation,
  useGetPurchaseBySupplierAndUserQuery,
} from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetSingleSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { useSupplierPaymentBySupplierUserQuery } from '@/redux/api/supplierPayments/supplierPayments'
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
}: any) => {
  const id = supplierId
  const { data, isLoading } = useGetSingleSupplierQuery(id)

  const ids = `${data?.id},${userData?.id}`
  const { data: supplierPayment } = useSupplierPaymentBySupplierUserQuery(ids)

  const userSupplierIds = `${data?.id},${userData?.id}`
  const { data: purchaseCount } =
    useGetPurchaseBySupplierAndUserQuery(userSupplierIds)

  // ----------FROM--------
  const [form] = Form.useForm()
  const [addANewPurchase] = useAddANewPurchaseMutation()

  const handleFinish = async (values: IFormValues) => {
    // @ts-ignore
    payloads.supplierPayment.totalPay = parseFloat(values.amount) || 0
    payloads.supplierPayment.paymentType = values?.paymentMethod
    message.loading({ content: 'Creating purchase...', key: 'creating' })

    // console.log(payloads)

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

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <div
      style={{ border: '1px solid #ddd', padding: '15px', marginTop: '10px' }}
    >
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
                      {purchaseCount?.length ? purchaseCount?.length : 0}
                    </Text>
                    <Text>Total transitions</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {supplierPayment?.totalSellPrice
                        ? supplierPayment?.totalSellPrice
                        : 0}
                    </Text>
                    <Text>Total Sells</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {supplierPayment?.totalDue
                        ? supplierPayment?.totalDue
                        : 0}
                    </Text>
                    <Text>Total Due</Text>
                  </Col>
                </Row>
                <Text style={{ marginTop: '10px', display: 'inline-block' }}>
                  {data?.presentAddress}
                </Text>
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
          {isLoading ? (
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
                    userData?.profileImage
                      ? `http://localhost:7000${userData?.profileImage}`
                      : 'https://via.placeholder.com/300'
                  }
                  style={{ marginBottom: 16 }}
                />
                <Title level={4} style={{ marginBottom: 0 }}>
                  {`${userData?.firstName} ${userData?.middleName} ${userData?.lastName}`}
                </Title>
                <Row justify="space-around" style={{ marginTop: 16 }}>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {supplierPayment?.totalPay
                        ? supplierPayment?.totalPay
                        : 0}
                    </Text>
                    <Text>Total Pay</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {supplierPayment?.totalDue
                        ? supplierPayment?.totalDue
                        : 0 + supplierPayment?.totalSellPrice
                        ? supplierPayment?.totalSellPrice
                        : 0}
                    </Text>
                    <Text>Total buy</Text>
                  </Col>
                  <Col style={userInfoSupplierPay}>
                    <Text strong>
                      {supplierPayment?.totalDue
                        ? supplierPayment?.totalDue
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
