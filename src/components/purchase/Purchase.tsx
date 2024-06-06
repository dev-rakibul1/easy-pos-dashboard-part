'use client'

import { color } from '@/constants/global'
import {
  useGetAllProductQuery,
  useGetSingleProductQuery,
} from '@/redux/api/productApi/productApi'
import { useGetAllSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { getUserInfo } from '@/services/auth.services'
import { IGenericVariant, IPurchaseFormData } from '@/types'
import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { inputFormStyle, inputPlusBtnStyle } from '../styles/style'
import ActionBar from '../ui/ActionBar'
import PurchaseTable from './PurchaseTable'
import UserInfo from './UserInfo'
import VariantModal from './variants/VariantModal'
const { Item } = Form
const { Option } = Select
const { Text } = Typography

export interface IFormValues {
  amount: number
  paymentMethod: string
}

const PurchaseForm = ({ isChecked, userData }: any) => {
  const { role } = getUserInfo() as any
  const router = useRouter()
  const [form] = Form.useForm()
  const [subTotal, setSubtotal] = useState<number>(0)
  const [openVariantModal, setOpenVariantModal] = useState(false)
  const [payPayloads, setPayPayloads] = useState({})
  const [formValues, setFormValues] = useState<IFormValues>({
    amount: 0,
    paymentMethod: '',
  })

  // Handle pay amount from user
  const handlePayChange = (
    changedValues: Partial<IFormValues>,
    allValues: IFormValues
  ) => {
    setFormValues(allValues)
  }

  const handleFinish = (values: IFormValues) => {
    setPayPayloads(values)
  }

  const [formData, setFormData] = useState<IPurchaseFormData>({
    supplierId: '',
    productId: '',
    userId: '',
    purchaseRate: 0,
    sellingPrice: 0,
    discounts: 0,
    vats: 0,
    totalPrice: 0,
    productStock: 0,
    othersStock: 0,
    color: '',
    ram: '',
    room: '',
  })
  const [supplierId, setSupplierId] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [productColor, setProductColor] = useState<string>('')
  const [productStock, setProductStock] = useState<number>(0)
  const [othersStock, setOthersStock] = useState<number>(0)
  const [storeVariants, setStoreVariants] = useState<IGenericVariant[]>([])
  const [purchaseData, setPurchaseData] = useState<any[]>([])
  const [payloads, setPayloads] = useState({})

  const onFormSubmit = (values: IGenericVariant) => {
    setStoreVariants((prevData: IGenericVariant[]) => prevData.concat(values))
  }

  // Supplier options
  const { data } = useGetAllSupplierQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const suppliers: ISupplier[] = data?.suppliers
  const supplierOptions = suppliers?.map((supplier: any) => {
    return {
      label: `${supplier?.firstName} ${supplier?.middleName} ${supplier?.lastName}`,
      value: supplier?.id,
    }
  })

  // Product options
  const { data: products } = useGetAllProductQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const getProductsOption: IProduct[] = products?.products

  const productOptions = getProductsOption?.map((product: any) => {
    return {
      label: `${product?.productName}`,
      value: product?.id,
    }
  })

  // Redirect
  const handleAddSupplier = () => {
    router.push(`/${role}/add-supplier`)
  }
  const handleAddProduct = () => {
    router.push(`/${role}/add-product`)
  }

  const onChangeProductId = (value: string) => {
    setProductId(value)
  }
  const onChangeSupplierId = (value: string) => {
    setSupplierId(value)
  }

  const handleColorChange = (value: string) => {
    setProductColor(value)
  }

  useEffect(() => {}, [supplierId])
  useEffect(() => {}, [productId])
  useEffect(() => {}, [productColor])

  const onSearch = (value: string) => {
    // console.log('search:', value)
  }

  const onFormValuesChange = (
    changedValues: any,
    allValues: IPurchaseFormData
  ) => {
    setFormData(allValues)

    // Update productStock and othersStock values in the state
    if ('productStock' in changedValues) {
      setProductStock(parseInt(changedValues['productStock']) || 0)
    }
    if ('othersStock' in changedValues) {
      setOthersStock(parseInt(changedValues['othersStock']) || 0)
    }
  }

  // Others stock calculation
  useEffect(() => {
    const vatRate = formData?.vats || 0
    const productStockAmount = productStock || 0
    const otherStockAmount = othersStock || 0

    // Calculate the purchase rate amount considering the stock
    const stockAmount = isChecked ? productStockAmount : otherStockAmount
    const purchaseRateAmount = (formData?.purchaseRate || 0) * stockAmount

    const vatAmount = purchaseRateAmount * (vatRate / 100)

    const discountRate = formData?.discounts || 0
    const discountAmount = purchaseRateAmount * (discountRate / 100)

    const subTotalPrice = purchaseRateAmount - discountAmount + vatAmount

    setSubtotal(subTotalPrice)
  }, [formData, isChecked, productStock, othersStock])

  formData.userId = userData?.id

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      supplierId,
      productId,
      totalPrice: subTotal,
      color: productColor,
      othersStock,
      productStock,
    }))
  }, [
    supplierId,
    productId,
    subTotal,
    productColor,
    othersStock,
    productStock,
    formData.totalPrice,
  ])

  const id = productId
  const { data: singleProduct } = useGetSingleProductQuery(id)

  // Combine the previous purchase data with the new product data

  const onFinish = (values: any) => {
    // if (isChecked) {
    //   if (storeVariants.length !== formData.productStock) {
    //     message.error(
    //       `Expected ${formData.productStock} variants, but got ${storeVariants.length}.`
    //     )
    //     return
    //   }
    // }

    // @ts-ignore
    formData.discounts = parseFloat(formData?.discounts)
    // @ts-ignore
    formData.vats = parseFloat(formData?.vats)
    // @ts-ignore
    formData.sellingPrice = parseFloat(formData?.sellingPrice)
    // @ts-ignore
    formData.purchaseRate = parseFloat(formData?.purchaseRate)

    const newPurchaseData = [formData, ...purchaseData].map(item => {
      const newItem = { ...item }

      if (item !== formData) {
        newItem.productName = item?.productName
        newItem.brandName = item?.brandName
      } else {
        newItem.productName = singleProduct?.productName
        newItem.brandName = singleProduct?.brandName
      }

      return newItem
    })

    // const newPurchaseData = [formData, ...purchaseData]
    // newPurchaseData.forEach(item => {
    //   item.productName = singleProduct.productName
    //   item.brandName = singleProduct.brandName
    // })

    setPurchaseData(newPurchaseData)
    setPayloads({
      supplierPayment: {
        totalPay: formValues.amount,
        supplierId: supplierId,
        userId: userData?.id,
      },
      variants: storeVariants,
      purchase: newPurchaseData, // Use the updated purchaseData
    })
    // reset form data after submit
    form.resetFields() // Reset Ant Design form fields
    setFormData({
      // Reset formData state
      supplierId: '',
      productId: '',
      userId: '',
      purchaseRate: 0,
      sellingPrice: 0,
      discounts: 0,
      vats: 0,
      totalPrice: 0,
      productStock: 0,
      othersStock: 0,
      color: '',
      ram: '',
      room: '',
    })
    setProductId('')
    setProductColor('')
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  // variant condition
  const imeiCount = isChecked
    ? formData.productStock && formData.productStock > 100
      ? message.warning('Max 100 products per addition')
      : formData.productStock
    : 0

  return (
    <div style={{ background: '#f0f2f5' }}>
      {/* variant modals */}
      <VariantModal
        setOpenVariantModal={setOpenVariantModal}
        openVariantModal={openVariantModal}
        count={imeiCount}
        productId={productId}
        onFormSubmit={onFormSubmit}
      />

      <div style={{ border: '1px solid #ddd', padding: '15px' }}>
        <Form
          form={form}
          name="purchaseForm"
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onFormValuesChange}
        >
          <Row gutter={16}>
            {/* Supplier  */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Supplier">
                <div style={inputFormStyle}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onChange={onChangeSupplierId}
                    onSearch={onSearch}
                    size="large"
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={supplierOptions}
                  >
                    {supplierOptions?.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  <div style={inputPlusBtnStyle} onClick={handleAddSupplier}>
                    <PlusOutlined />
                  </div>
                </div>
              </Form.Item>
            </Col>
            {/* Product  */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Product">
                <div style={inputFormStyle}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onChange={onChangeProductId}
                    onSearch={onSearch}
                    size="large"
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={productOptions}
                  >
                    {productOptions?.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  <div style={inputPlusBtnStyle} onClick={handleAddProduct}>
                    <PlusOutlined />
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="purchaseRate"
                label="Purchase Rate"
                rules={[
                  {
                    required: true,
                    message: 'Please input the purchase rate!',
                  },
                ]}
              >
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="sellingPrice"
                label="Selling Price"
                rules={[
                  {
                    required: true,
                    message: 'Please input the selling price!',
                  },
                ]}
              >
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="number"
                />
              </Form.Item>
            </Col>

            {/* Stock count */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label={!isChecked ? 'Stock' : 'IMEI Stock'}
                labelAlign="left"
                wrapperCol={{ span: 24 }}
                style={{ marginBottom: 0 }}
                name={!isChecked ? 'othersStock' : 'productStock'}
                rules={[{ required: true, message: 'Please input the stock!' }]}
              >
                <div style={inputFormStyle}>
                  <Input size="large" type="number" min={0} />
                  <div
                    style={{
                      ...inputPlusBtnStyle,
                      opacity: isChecked ? '1' : '0.5',
                      cursor: isChecked ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() =>
                      isChecked
                        ? !imeiCount ||
                          (formData.productStock && formData.productStock > 100)
                          ? message.warning({
                              content: !imeiCount
                                ? 'Variant number is required'
                                : 'Can only add 1 to 100 products at a time.',
                              type: 'warning',
                            })
                          : setOpenVariantModal(true)
                        : setOpenVariantModal(false)
                    }
                  >
                    <PlusOutlined />
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="ram"
                label="Ram"
                rules={[{ required: true, message: 'Please input the ram!' }]}
              >
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="text"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="room"
                label="Room"
                rules={[{ required: true, message: 'Please input the room!' }]}
              >
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="text"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="discounts" label="Discount">
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="vats" label="Vats">
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Color"
                labelAlign="left"
                wrapperCol={{ span: 24 }}
                style={{ marginBottom: 0 }}
              >
                <div style={inputFormStyle}>
                  <Select
                    showSearch
                    placeholder="Select a color"
                    optionFilterProp="children"
                    onChange={handleColorChange}
                    onSearch={onSearch}
                    size="large"
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={color}
                  ></Select>
                  <div style={inputPlusBtnStyle}>
                    <PlusOutlined />
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Total Price">
                <Input
                  size="large"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  type="number"
                  value={subTotal}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: '15px' }}
          >
            Add to cart
          </Button>
        </Form>
      </div>
      {purchaseData.length && (
        <div style={{ marginTop: '15px' }}>
          {/* @ts-ignore */}
          <PurchaseTable payloads={payloads} formValues={formValues} />
        </div>
      )}

      {/* User payment info */}
      {supplierId && (
        <div style={{ marginTop: '15px' }}>
          <ActionBar title="User payment information"></ActionBar>
          <UserInfo
            supplierId={supplierId}
            userData={userData}
            formValues={formValues}
            setFormValues={setFormValues}
            handlePayChange={handlePayChange}
            handleFinish={handleFinish}
            payloads={payloads}
            setPayloads={setPayloads}
          />
        </div>
      )}
    </div>
  )
}

export default PurchaseForm
