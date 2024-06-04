'use client'

import { color } from '@/constants/global'
import { useGetAllProductQuery } from '@/redux/api/productApi/productApi'
import { useGetAllSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { IGenericVariant, IPurchaseFormData } from '@/types'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { inputFormStyle, inputPlusBtnStyle } from '../styles/style'
import VariantModal from './variants/VariantModal'
const { Item } = Form
const { Option } = Select

const PurchaseForm = ({ isChecked }: any) => {
  const [form] = Form.useForm()
  const [subTotal, setSubtotal] = useState<number>(0)
  const [openVariantModal, setOpenVariantModal] = useState(false)

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
  })
  const [supplierId, setSupplierId] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [productColor, setProductColor] = useState<string>('')
  const [productStock, setProductStock] = useState<number>(0)
  const [othersStock, setOthersStock] = useState<number>(0)
  const [variants, setVariants] = useState<IGenericVariant[]>([])

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

  const onFinishFailed = (errorInfo: string) => {
    console.log('Failed:', errorInfo)
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
    console.log('search:', value)
  }

  const onFormValuesChange = (
    changedValues: any,
    allValues: IPurchaseFormData
  ) => {
    console.log('Form Values Changed:', allValues)
    setFormData(allValues)

    // Update productStock and othersStock values in the state
    if ('productStock' in changedValues) {
      setProductStock(changedValues['productStock'])
    }
    if ('otherStock' in changedValues) {
      setOthersStock(changedValues['otherStock'])
    }
  }

  // Others stock calculation
  useEffect(() => {
    const vatRate = formData?.vats || 0
    const amount = formData?.sellingPrice || 0
    const vatAmount = amount * (vatRate / 100)

    const discountRate = formData?.discounts || 0
    const discountAmount = amount * (discountRate / 100)

    const totalPrice = formData?.sellingPrice || 0

    const subTotalPrice = totalPrice - discountAmount + vatAmount

    setSubtotal(subTotalPrice)
  }, [formData])

  useEffect(() => {
    formData.supplierId = supplierId
    formData.productId = productId
    formData.totalPrice = subTotal
    formData.color = productColor
    formData.othersStock = formData.othersStock
    formData.productStock = formData.productStock
  }, [
    supplierId,
    productId,
    formData,
    subTotal,
    productColor,
    formData.othersStock,
    formData.productStock,
  ])

  const supplierAndUser = {
    totalPay: 100,
    supplierId: supplierId,
    userId: '24387dbd-9ed8-45c1-80ff-fc2b4bdab360',
  }

  const purchaseInformation = {
    supplierPayment: supplierAndUser,
    variants: variants,
    purchase: formData,
  }

  const onFinish = (values: any) => {
    console.log('Success:', purchaseInformation)
  }

  console.log(purchaseInformation)

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  // variant condition
  const imeiCount = isChecked ? formData.productStock : 0

  return (
    <div style={{ padding: '20px', background: '#f0f2f5' }}>
      {/* variant modals */}
      <VariantModal
        setOpenVariantModal={setOpenVariantModal}
        openVariantModal={openVariantModal}
        count={imeiCount}
        variants={variants}
        setVariants={setVariants}
      />

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
                <div style={inputPlusBtnStyle}>
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
                <div style={inputPlusBtnStyle}>
                  <PlusOutlined />
                </div>
              </div>
            </Form.Item>
          </Col>

          {/* Stock count */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label={!isChecked ? 'Stock' : 'IMEI Stock'}
              labelAlign="left"
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: 0 }}
            >
              <div style={inputFormStyle}>
                <Input
                  size="large"
                  name={!isChecked ? 'otherStock' : 'productStock'}
                  onChange={e => {
                    const { name, value } = e.target
                    setFormData(prevState => ({
                      ...prevState,
                      [name]: value,
                    }))
                  }}
                />
                <div
                  style={{
                    ...inputPlusBtnStyle,
                    opacity: isChecked ? '1' : '0.5',
                    cursor: isChecked ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() =>
                    isChecked
                      ? !imeiCount
                        ? message.warning({
                            content: 'Variants count is require!',
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
              name="purchaseRate"
              label="Purchase Rate"
              rules={[
                { required: true, message: 'Please input the purchase rate!' },
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
                { required: true, message: 'Please input the selling price!' },
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
            <Form.Item label="Total Price">
              <Input
                size="large"
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                type="number"
                value={subTotal}
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
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{ marginTop: '15px' }}
        >
          Add to cart
        </Button>
      </Form>
    </div>
  )
}

export default PurchaseForm
