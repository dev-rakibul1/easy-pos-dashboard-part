import {
  useGetAllCustomerQuery,
  useGetSingleCustomerQuery,
} from '@/redux/api/customerApi/customerApi'
import {
  useGetAllStockInProductQuery,
  useGetSingleProductQuery,
} from '@/redux/api/productApi/productApi'
import { useGetSingleVariantQuery } from '@/redux/api/variantApi/variantApi'
import { getUserInfo } from '@/services/auth.services'
import { ICustomer, IProduct, IVariant } from '@/types'
import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from 'antd'
const { Text } = Typography

import DiscountsModal from '@/modals/discounts/DiscountsModal'
import VatsModal from '@/modals/vats/VatsModal'
import { useGetAllDiscountQuery } from '@/redux/api/discountApi/discountApi'
import { useGetAllVatsQuery } from '@/redux/api/vatApi/vatApi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { inputFormStyle, inputPlusBtnStyle } from '../styles/style'
import SellTable from './SellTable'

type IFormType = {
  selectProduct: string
  selectCustomer: string
  selectVariant: string
  sellingPrice: number
  totalPrice: number
  vats: number
  discounts: number
  productName: string
  modelName: string
  customerName?: string
  imeiNumber: string
  color: string
  ram?: any
  rom?: any
  variantIds: any
  quantity: number
}

export interface ISellVariant {
  imeiNumber: string
  ram: string
  rom: string
  color: string
  variantId: string
  productId: string
}

export interface IProductData {
  productId: string
  customerId: string
  variantId: string
  customerName: string
  discounts: number
  vats: number
  productName: string
  modelName: string
  quantity: number
  sellingPrice: number
  totalPrice: number
  variantIds: unknown | any
  variants: ISellVariant[]
}

const PosPage = () => {
  const { role } = getUserInfo() as any
  const [form] = Form.useForm()
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [selectCustomer, setSelectCustomer] = useState<string>('')
  const [selectVariant, setSelectVariant] = useState<string>('')
  const [selectDiscounts, setSelectDiscounts] = useState<number>(0)
  const [selectVats, setSelectVats] = useState<number>(0)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [subTotal, setSubtotal] = useState<number>(0)
  // const [sellInfo, setSellInfo] = useState<IFormType[]>([])
  const [sellPayloads, setSellPayloads] = useState<IProductData[]>([])
  const router = useRouter()

  const [formData, setFormData] = useState<IFormType>({
    selectCustomer: '',
    selectProduct: '',
    selectVariant: '',
    discounts: 0,
    sellingPrice: 0,
    vats: 0,
    totalPrice: 0,
    productName: '',
    customerName: '',
    modelName: '',
    imeiNumber: '',
    color: '',
    ram: '',
    rom: '',
    variantIds: '',
    quantity: 0,
  })

  // --------------PRODUCTS--------------
  const { data: products, isLoading: isProductLoading } =
    useGetAllStockInProductQuery({
      pollingInterval: 15000,
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    })
  // @ts-ignore
  const getProductOption: IProduct[] = products?.products

  const productOptions = getProductOption?.map((product: IProduct) => {
    return {
      label: `${product?.productName} | ${product?.uniqueId}`,
      value: product?.id,
    }
  })

  // Single product get by id
  const { data: singleProductById, isLoading: isSingleProductLoading } =
    useGetSingleProductQuery(selectProduct)

  // get product variants
  const { data: singleVariantsById, isLoading: getSingleVariantLoading } =
    useGetSingleVariantQuery(selectVariant)
  const variantsData = singleProductById?.variants
  // @ts-ignore
  const getVariantOption: IVariant[] = variantsData

  const variantOptions = getVariantOption?.map((variant: IVariant) => {
    return {
      label: `${variant?.imeiNumber} | ${variant?.color}`,
      value: variant?.id,
    }
  })

  // Customer
  const { data: customers, isLoading: isCustomerLoading } =
    useGetAllCustomerQuery({
      pollingInterval: 15000,
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    })
  // @ts-ignore
  const getCustomerOption: ICustomer[] = customers?.customers

  const customerOptions = getCustomerOption?.map((customer: ICustomer) => {
    return {
      label: `${customer?.firstName} | ${customer?.uniqueId}`,
      value: customer?.id,
    }
  })

  // Single customer get
  const { data: singleCustomerById } = useGetSingleCustomerQuery(selectCustomer)

  //--------------VAT & DISCOUNT OPTIONS--------------
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

  const handleDiscountsChange = (value: number) => {
    setSelectDiscounts(value)
  }

  // Options
  const vatsOptions = vats.map(vat => ({
    label: `${vat.name} ${vat.vatValue}${vat.vatType} `,
    value: vat.vatValue,
  }))

  const discountsOptions = discountsArray?.map(discount => ({
    label: `${discount.name} ${discount.discountValue}${discount.discountType} `,
    value: discount.discountValue,
  }))

  useEffect(() => {
    setSelectVariant('')
  }, [selectProduct])

  // Create variants info
  let variantIds = []
  variantIds.push(selectVariant && selectVariant)

  useEffect(() => {
    formData.discounts = selectDiscounts
    formData.vats = selectVats
    formData.selectVariant = selectVariant
    formData.selectCustomer = selectCustomer
    formData.selectProduct = selectProduct
    formData.totalPrice = subTotal
    formData.productName = singleProductById?.productName
    formData.modelName = singleProductById?.modelName

    formData.customerName = `${singleCustomerById?.firstName} ${
      singleCustomerById?.middleName ? singleCustomerById?.middleName : ''
    } ${singleCustomerById?.lastName}`

    formData.ram = singleVariantsById?.ram
    formData.rom = singleVariantsById?.rom

    formData.color = singleVariantsById?.color
    formData.imeiNumber = singleVariantsById?.imeiNumber
    formData.variantIds = variantIds
  }, [
    formData,
    selectCustomer,
    selectDiscounts,
    selectProduct,
    selectVariant,
    selectVats,
    singleCustomerById?.firstName,
    singleCustomerById?.lastName,
    singleCustomerById?.middleName,
    singleProductById?.modelName,
    singleProductById?.productName,
    singleVariantsById?.color,
    singleVariantsById?.imeiNumber,
    singleVariantsById?.ram,
    singleVariantsById?.rom,
    subTotal,
    variantIds,
  ])

  const onFinish = (values: any) => {
    const newFormData = {
      ...formData,
      sellingPrice: Number(values.sellingPrice),
    }

    const {
      imeiNumber,
      ram,
      rom,
      color,
      selectCustomer: cId,
      selectProduct: pId,
      selectVariant: vId,
      ...restData
    } = newFormData

    // console.log(newFormData)

    const variantObj: ISellVariant = {
      imeiNumber,
      ram,
      rom,
      color,
      variantId: vId,
      productId: pId,
    }

    // @ts-ignore
    const sellObject: IProductData = {
      ...restData,
      productId: pId,
      customerId: cId,
      variantId: vId,
      variants: [variantObj],
      quantity: 1,
    }

    // Check if the variant already exists in any product
    const isExistVariant = sellPayloads.some(product =>
      product.variantIds.includes(sellObject.variantId)
    )

    if (isExistVariant) {
      message.warning('The variant is already selected!')
      return
    }

    const existingProduct = sellPayloads.find(item => item.productId === pId)

    if (existingProduct) {
      const isMatchVariant = existingProduct.variants.some(
        variant =>
          variant.ram === variantObj.ram && variant.rom === variantObj.rom
      )

      if (isMatchVariant) {
        const updatedSellPayloads = sellPayloads.map(item => {
          if (item.productId === pId) {
            return {
              ...item,
              quantity: item.quantity + 1,
              variants: [...item.variants, variantObj],
              variantIds: [...item.variantIds, vId],
            }
          }
          return item
        })
        setSellPayloads(updatedSellPayloads)
      } else {
        setSellPayloads([sellObject, ...sellPayloads])
      }
    } else {
      setSellPayloads([sellObject, ...sellPayloads])
    }

    // Reset form fields except selectCustomer
    setFormData({
      ...formData,
      selectProduct: '',
      selectVariant: '',
      discounts: 0,
      sellingPrice: 0,
      vats: 0,
      totalPrice: 0,
      modelName: '',
      productName: '',
      customerName: '',
      ram: '',
      rom: '',
      color: '',
      imeiNumber: '',
      variantIds: '',
      quantity: 0,
    })

    // Reset other states
    setSelectVariant('')
    setSelectCustomer('')
    setSelectProduct('')
    setSubtotal(0)
    form.resetFields()
  }

  const handleProductChange = (value: string) => {
    setSelectProduct(value)
  }
  const handleCustomerChange = (value: string) => {
    setSelectCustomer(value)
  }
  const handleVariantChange = (value: string) => {
    setSelectVariant(value)
  }
  const handleSellingPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value)
    setSellingPrice(value)
  }

  const onSearch = (value: string) => {
    // console.log('search:', value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string | number }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  // Redirect to add customer page
  const handleAddCustomer = () => {
    router.push(`/${role}/add-customers`)
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

  const handleVatsChange = (value: number) => {
    setSelectVats(value)
  }

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

  //----------VAT, DISCOUNT AND OTHERS CALCULATION--------
  useEffect(() => {
    const vatRate = selectVats || 0
    const discountRate = selectDiscounts || 0
    const defaultSellingPrice = sellingPrice ? sellingPrice : 0

    const vatAmount = defaultSellingPrice * (vatRate / 100)
    const discountAmount = defaultSellingPrice * (discountRate / 100)
    const subTotalPrice = defaultSellingPrice - discountAmount + vatAmount

    setSubtotal(subTotalPrice)
  }, [
    selectDiscounts,
    selectVats,
    sellingPrice,
    selectCustomer,
    selectProduct,
    selectVariant,
    setSubtotal,
    subTotal,
  ])

  return (
    <div>
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
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div
          style={{ border: '1px solid #ddd', padding: '8px', margin: '8px' }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item
                    label="Select product"
                    name="product"
                    rules={[
                      {
                        required: true,
                        message: 'Product selection is required.',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onChange={handleProductChange}
                      onSearch={onSearch}
                      size="large"
                      style={{ width: '100%' }}
                      filterOption={filterOption}
                      options={productOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Product info */}
              {selectProduct !== '' ? (
                <div>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item label="Select variant" name="variants">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onChange={handleVariantChange}
                        onSearch={onSearch}
                        size="large"
                        style={{ width: '100%' }}
                        filterOption={filterOption}
                        options={variantOptions}
                      />
                    </Form.Item>
                  </Col>
                  {isSingleProductLoading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <Text>
                        <Text strong>Name:</Text>{' '}
                        {singleProductById?.productName
                          ? singleProductById?.productName
                          : 'N/A'}
                      </Text>
                      <br />
                      <Text>
                        <Text strong>Brand:</Text>{' '}
                        {singleProductById?.brandName
                          ? singleProductById?.brandName
                          : 'N/A'}
                      </Text>
                      <br />
                      <Text>
                        <Text strong>Stock:</Text>{' '}
                        {`${
                          singleProductById?.variants?.length
                            ? singleProductById?.variants?.length
                            : 0
                        } pics`}
                      </Text>
                      <br />
                    </>
                  )}
                  {selectVariant !== '' ? (
                    getSingleVariantLoading ? (
                      <Spin size="small" />
                    ) : (
                      <>
                        <Text>
                          <Text strong>Imei number:</Text>{' '}
                          {singleVariantsById?.imeiNumber
                            ? singleVariantsById?.imeiNumber
                            : 'N/A'}
                        </Text>
                        <br />
                        <Text>
                          <Text strong>Ram:</Text>{' '}
                          {singleVariantsById?.ram
                            ? singleVariantsById?.ram
                            : 'N/A'}{' '}
                          GB
                        </Text>
                        <br />
                        <Text>
                          <Text strong>Rom:</Text>{' '}
                          {singleVariantsById?.rom
                            ? singleVariantsById?.rom
                            : 'N/A'}{' '}
                          GB
                        </Text>
                        <br />
                        <Text>
                          <Text strong>Color:</Text>{' '}
                          {singleVariantsById?.color
                            ? singleVariantsById?.color
                            : 'N/A'}
                        </Text>
                      </>
                    )
                  ) : null}
                </div>
              ) : null}
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Select customer"
                name="customer"
                rules={[
                  {
                    required: true,
                    message: 'Customer selection is required.',
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={handleCustomerChange}
                  onSearch={onSearch}
                  size="large"
                  style={{ width: '100%' }}
                  filterOption={filterOption}
                  options={customerOptions}
                />
              </Form.Item>

              {selectCustomer !== '' ? (
                isCustomerLoading ? (
                  <Spin size="small" />
                ) : (
                  <>
                    <Text>
                      <Text strong>Name:</Text>{' '}
                      {`${
                        singleCustomerById?.firstName
                          ? singleCustomerById?.firstName
                          : ''
                      } ${
                        singleCustomerById?.middleName
                          ? singleCustomerById?.middleName
                          : ''
                      } ${
                        singleCustomerById?.lastName
                          ? singleCustomerById?.lastName
                          : ''
                      } ${
                        !singleCustomerById?.firstName &&
                        !singleCustomerById?.firstName
                          ? 'N/A'
                          : ''
                      }`}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Phone:</Text>{' '}
                      {singleCustomerById?.phoneNo
                        ? singleCustomerById?.phoneNo
                        : 'N/A'}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Email:</Text>{' '}
                      {singleCustomerById?.email
                        ? singleCustomerById?.email
                        : 'N/A'}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>NID:</Text>{' '}
                      {singleCustomerById?.nid
                        ? singleCustomerById?.nid
                        : 'N/A'}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Address:</Text>{' '}
                      {singleCustomerById?.presentAddress
                        ? singleCustomerById?.presentAddress
                        : 'N/A'}
                    </Text>
                  </>
                )
              ) : null}
            </Col>

            {/* Selling rate */}
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Selling Rate"
                name="sellingPrice"
                rules={[
                  {
                    required: true,
                    message: 'Selling price is required.',
                  },
                ]}
              >
                <Input
                  size="large"
                  type="number"
                  style={{ width: '100%' }}
                  onChange={handleSellingPriceChange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Discounts"
                labelAlign="left"
                name="discounts"
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

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Vats"
                labelAlign="left"
                name="vats"
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

            {/* Total cell price */}
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Total Price"
                labelAlign="left"
                wrapperCol={{ span: 24 }}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  value={subTotal}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Button type="primary" htmlType="submit">
          Add to cart
        </Button>
      </Form>

      <div style={{ marginTop: '15px' }}>
        <SellTable payloads={sellPayloads} setSellPayloads={setSellPayloads} />
      </div>
    </div>
  )
}

export default PosPage
