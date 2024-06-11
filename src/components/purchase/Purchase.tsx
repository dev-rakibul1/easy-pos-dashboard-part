'use client'

import ColorModal from '@/modals/color/ColorModal'
import DiscountsModal from '@/modals/discounts/DiscountsModal'
import VatsModal from '@/modals/vats/VatsModal'
import { useGetAllColorQuery } from '@/redux/api/colorApi/colorApi'
import { useGetAllDiscountQuery } from '@/redux/api/discountApi/discountApi'
import {
  useGetAllProductQuery,
  useGetSingleProductQuery,
} from '@/redux/api/productApi/productApi'
import { useGetAllSupplierQuery } from '@/redux/api/supplierApi/supplierApi'
import { useGetAllVatsQuery } from '@/redux/api/vatApi/vatApi'
import { getUserInfo } from '@/services/auth.services'
import {
  IColor,
  IDiscounts,
  IGenericVariant,
  IPurchaseFormData,
  IVats,
} from '@/types'
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
import TestTable from './Test'
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
  const [selectVats, setSelectVats] = useState<number>(0)
  const [selectDiscounts, setSelectDiscounts] = useState<number>(0)
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
      label: `${supplier?.firstName} ${
        supplier?.middleName === null ? '' : supplier?.middleName
      } ${supplier?.lastName} | ${supplier?.uniqueId}`,
      value: supplier?.id,
    }
  })

  // Product options
  const { data: products } = useGetAllProductQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const getProductsOption: IProduct[] = products?.products

  const productOptions = getProductsOption?.map((product: any) => {
    return {
      label: `${product?.productName} | ${product?.uniqueId}`,
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
  const handleVatsChange = (value: number) => {
    setSelectVats(value)
  }
  const handleDiscountsChange = (value: number) => {
    setSelectDiscounts(value)
  }

  useEffect(() => {}, [supplierId])
  useEffect(() => {}, [productId])
  useEffect(() => {}, [productColor])
  useEffect(() => {}, [selectVats])
  useEffect(() => {}, [selectDiscounts])

  const onSearch = (value: string) => {
    // console.log('search:', value)
  }

  // Reset form fields when isChecked changes
  useEffect(() => {
    if (isChecked) {
      form.setFieldsValue({ othersStock: 0 })
      setOthersStock(0)
    } else {
      form.setFieldsValue({ productStock: 0 })
      setProductStock(0)
    }
  }, [isChecked, form])

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
      vats: selectVats,
      discounts: selectDiscounts,
    }))
  }, [
    supplierId,
    productId,
    subTotal,
    productColor,
    othersStock,
    productStock,
    formData.totalPrice,
    selectVats,
    selectDiscounts,
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
        productId: productId,
      },
      variants: storeVariants,
      purchase: newPurchaseData, // Use the updated purchaseData
    })
    // reset form data after submit
    form.resetFields()
    setFormData({
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
    setProductColor('')
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string | number }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  // variant condition
  const imeiCount = isChecked
    ? formData.productStock && formData.productStock > 100
      ? message.warning('Max 100 products per addition')
      : formData.productStock
    : 0

  useEffect(() => {
    if (isChecked) {
      form.resetFields(['othersStock'])
    } else {
      form.resetFields(['productStock'])
    }
  }, [isChecked, form])

  // Fetch options for selects
  const { data: vatsData } = useGetAllVatsQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const vats: IVats[] = vatsData?.vats || []

  const { data: discountsData } = useGetAllDiscountQuery({
    limit: 100,
    page: 1,
  })
  // @ts-ignore
  const discountsArray: IDiscounts[] = discountsData?.discounts || []

  const { data: colorData } = useGetAllColorQuery({
    limit: 100,
    page: 1,
  })
  // @ts-ignore
  const colorArray: IColor[] = colorData?.colors || []

  // Options
  const vatsOptions = vats.map(vat => ({
    label: `${vat.name} ${vat.vatValue} ${vat.vatType} `,
    value: vat.vatValue,
  }))

  const discountsOptions = discountsArray?.map(discount => ({
    label: `${discount.name} ${discount.discountValue} ${discount.discountType} `,
    value: discount.discountValue,
  }))

  const colorOptions = colorArray?.map(color => ({
    label: `${color.name} ${color.colorCode}`,
    value: `${color.name} ${color.colorCode}`,
  }))

  // -----------Vats modal-----------
  const [isVatsModal, setIsVatsModal] = useState(false)
  const showVatsModal = () => {
    setIsVatsModal(true)
  }

  const handleVatOk = () => {
    setIsVatsModal(false)
  }

  const handleVatsCancel = () => {
    setIsVatsModal(false)
  }
  // -----------Discounts modal-----------
  const [isDiscountsModal, setIsDiscountsModal] = useState(false)
  const showDiscountsModal = () => {
    setIsDiscountsModal(true)
  }

  const handleDiscountsOk = () => {
    setIsDiscountsModal(false)
  }

  const handleDiscountsCancel = () => {
    setIsDiscountsModal(false)
  }
  // -----------Color modal-----------
  const [isColorModal, setIsColorModal] = useState(false)
  const showColorModal = () => {
    setIsColorModal(true)
  }

  const handleColorOk = () => {
    setIsColorModal(false)
  }

  const handleColorCancel = () => {
    setIsColorModal(false)
  }

  return (
    <div style={{ background: '#f0f2f5' }}>
      {/* Start Crate a vats */}
      <VatsModal
        handleVatOk={handleVatOk}
        showVatsModal={showVatsModal}
        handleVatsCancel={handleVatsCancel}
        isVatsModal={isVatsModal}
        setIsVatsModal={setIsVatsModal}
      />
      {/* Start Crate a discounts */}
      <DiscountsModal
        handleDiscountsOk={handleDiscountsOk}
        showDiscountsModal={showDiscountsModal}
        handleDiscountsCancel={handleDiscountsCancel}
        isDiscountsModal={isDiscountsModal}
        setIsDiscountsModal={setIsDiscountsModal}
      />
      {/* Start Crate a color */}
      <ColorModal
        handleColorOk={handleColorOk}
        showColorModal={showColorModal}
        handleColorCancel={handleColorCancel}
        isColorModal={isColorModal}
        setIsColorModal={setIsColorModal}
      />

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
            {isChecked ? (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  label="IMEI Stock"
                  labelAlign="left"
                  wrapperCol={{ span: 24 }}
                  style={{ marginBottom: 0 }}
                  name="productStock"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the product stock!',
                    },
                  ]}
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
                            (formData.productStock &&
                              formData.productStock > 100)
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
            ) : (
              <>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item
                    name="othersStock"
                    label="Stock"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the others stock!',
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
                    name="ram"
                    label="Ram"
                    rules={[
                      { required: true, message: 'Please input the ram!' },
                    ]}
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
                    rules={[
                      { required: true, message: 'Please input the room!' },
                    ]}
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
                    label="Color"
                    labelAlign="left"
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: 0 }}
                  >
                    <div style={inputFormStyle}>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onChange={handleColorChange}
                        onSearch={onSearch}
                        size="large"
                        style={{ width: '100%' }}
                        filterOption={filterOption}
                        options={colorOptions}
                      ></Select>
                      <div style={inputPlusBtnStyle} onClick={showColorModal}>
                        <PlusOutlined />
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </>
            )}

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Discounts"
                labelAlign="left"
                wrapperCol={{ span: 24 }}
                style={{ marginBottom: 0 }}
              >
                <div style={inputFormStyle}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onChange={handleDiscountsChange}
                    onSearch={onSearch}
                    size="large"
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={discountsOptions}
                  ></Select>
                  <div style={inputPlusBtnStyle} onClick={showDiscountsModal}>
                    <PlusOutlined />
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Vats"
                labelAlign="left"
                wrapperCol={{ span: 24 }}
                style={{ marginBottom: 0 }}
              >
                <div style={inputFormStyle}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onChange={handleVatsChange}
                    onSearch={onSearch}
                    size="large"
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={vatsOptions}
                  ></Select>
                  <div style={inputPlusBtnStyle} onClick={showVatsModal}>
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
          {payloads.variants ? (
            <TestTable payloads={payloads} isChecked={isChecked} />
          ) : (
            <PurchaseTable payloads={payloads} formValues={formValues} />
          )}
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
