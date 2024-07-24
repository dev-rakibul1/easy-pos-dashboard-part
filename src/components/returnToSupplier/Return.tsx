import {
  useGetAllStockInProductQuery,
  useGetSingleProductQuery,
} from '@/redux/api/productApi/productApi'
import { useGetSingleVariantQuery } from '@/redux/api/variantApi/variantApi'
import { getUserInfo } from '@/services/auth.services'
import { IProduct, ISupplier, IVariant } from '@/types'
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from 'antd'
const { Text } = Typography

import { currencyName } from '@/constants/global'
import DiscountsModal from '@/modals/discounts/DiscountsModal'
import VatsModal from '@/modals/vats/VatsModal'
import { useGetSinglePurchaseQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import {
  useGetSingleSupplierQuery,
  useGetSuppliersBySupplierUserProductQuery,
} from '@/redux/api/supplierApi/supplierApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReturnTable from './ReturnTable'

type IFormType = {
  selectProduct: string
  selectSupplier: string
  selectVariant: string
  totalPrice: number
  productName: string
  modelName: string
  supplierName?: string
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
  supplierId: string
  variantId: string
  supplierName: string
  productName: string
  modelName: string
  quantity: number
  totalPrice: number
  variantIds: unknown | any
  variants: ISellVariant[]
}

const ReturnToSupplier = () => {
  const { role, uniqueId } = getUserInfo() as any
  const [form] = Form.useForm()
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [selectSupplier, setSelectCustomer] = useState<string>('')
  const [selectVariant, setSelectVariant] = useState<string>('')
  const [subTotal, setSubtotal] = useState<number>(0)
  const [sellPayloads, setSellPayloads] = useState<IProductData[]>([])
  const router = useRouter()

  const [formData, setFormData] = useState<IFormType>({
    selectSupplier: '',
    selectProduct: '',
    selectVariant: '',
    totalPrice: 0,
    productName: '',
    supplierName: '',
    modelName: '',
    imeiNumber: '',
    color: '',
    ram: '',
    rom: '',
    variantIds: '',
    quantity: 0,
  })

  //   Get user
  const { data: userData } = useGetSingleUserQuery(uniqueId)

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

  // Get single purchase
  const { data: singlePurchase } = useGetSinglePurchaseQuery(
    singleVariantsById?.purchaseId
  )

  // Conditionally set the parameters
  let userId = userData?.id
  let productId = singleProductById?.id
  const userAndProduct = `${userId},${productId}`
  let conditionFetch = formData.selectProduct ? userAndProduct : ''

  // suppliers get
  const { data: suppliers, isLoading: isCustomerLoading } =
    useGetSuppliersBySupplierUserProductQuery(conditionFetch)

  const getSupplierOption: ISupplier[] = suppliers
  const supplierOptions = getSupplierOption?.map((supplier: ISupplier) => {
    return {
      label: `${supplier?.firstName} | ${supplier?.uniqueId}`,
      value: supplier?.id,
    }
  })

  // Single customer get
  const { data: singleSupplierById } = useGetSingleSupplierQuery(selectSupplier)

  useEffect(() => {
    setSelectVariant('')
  }, [selectProduct])

  // Create variants info
  let variantIds = []
  variantIds.push(selectVariant && selectVariant)

  useEffect(() => {
    formData.selectVariant = selectVariant
    formData.selectSupplier = selectSupplier
    formData.selectProduct = selectProduct
    formData.totalPrice = subTotal
    formData.productName = singleProductById?.productName
    formData.modelName = singleProductById?.modelName

    formData.supplierName = `${singleSupplierById?.firstName} ${
      singleSupplierById?.middleName ? singleSupplierById?.middleName : ''
    } ${singleSupplierById?.lastName}`

    formData.ram = singleVariantsById?.ram
    formData.rom = singleVariantsById?.rom

    formData.color = singleVariantsById?.color
    formData.imeiNumber = singleVariantsById?.imeiNumber
    formData.variantIds = variantIds
  }, [
    formData,
    selectSupplier,
    selectProduct,
    selectVariant,
    singleSupplierById?.firstName,
    singleSupplierById?.lastName,
    singleSupplierById?.middleName,
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
    }

    const {
      imeiNumber,
      ram,
      rom,
      color,
      selectSupplier: cId,
      selectProduct: pId,
      selectVariant: vId,
      ...restData
    } = newFormData

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
      supplierId: cId,
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
      totalPrice: 0,
      modelName: '',
      productName: '',
      supplierName: '',
      ram: '',
      rom: '',
      color: '',
      imeiNumber: '',
      variantIds: '',
      quantity: 0,
    })

    // Reset other states
    setSelectVariant('')
    // setSelectCustomer('')
    setSelectProduct('')
    setSubtotal(0)

    // Store the phone number
    const supplier = `${singleSupplierById?.firstName} | ${singleSupplierById?.uniqueId}`

    // Reset all fields
    form.resetFields()

    // Set the phone number back
    form.setFieldsValue({ supplier: supplier })
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
    // Return calculation
    const totalPrice = singlePurchase?.totalPrice
    const totalQuantity = singlePurchase?.productStock
    const returnAmount = totalPrice / totalQuantity || 0

    // @ts-ignore
    const totalReturnAmount = parseFloat(returnAmount).toFixed(2)

    // @ts-ignore
    setSubtotal(totalReturnAmount)
  }, [singlePurchase?.productStock, singlePurchase?.totalPrice])

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
                      <Descriptions
                        bordered
                        column={1}
                        size="small"
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          margin: '20px auto',
                        }}
                        contentStyle={{ padding: '8px 16px' }}
                        labelStyle={{ padding: '8px 16px', fontWeight: 'bold' }}
                      >
                        <Descriptions.Item label="Name">
                          {singleProductById?.productName || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Brand">
                          {singleProductById?.brandName || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Selling price">
                          <Text type="success">
                            {' '}
                            {singlePurchase?.sellingPrice
                              ? `${singlePurchase.sellingPrice.toFixed(
                                  2
                                )} ${currencyName}`
                              : 'N/A'}
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Purchase rate">
                          <Text type="danger">
                            {' '}
                            {subTotal ? `${subTotal} ${currencyName}` : 'N/A'}
                          </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Stock">
                          {`${singleProductById?.variants?.length || 0} pics`}
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  )}
                  {selectVariant !== '' ? (
                    getSingleVariantLoading ? (
                      <Spin size="small" />
                    ) : (
                      <>
                        <Descriptions
                          bordered
                          column={1}
                          size="small"
                          style={{
                            width: '100%',
                            maxWidth: '100%',
                            margin: '20px auto',
                          }}
                          contentStyle={{ padding: '8px 16px' }}
                          labelStyle={{
                            padding: '8px 16px',
                            fontWeight: 'bold',
                          }}
                        >
                          <Descriptions.Item label="IMEI Number">
                            {singleVariantsById?.imeiNumber
                              ? singleVariantsById?.imeiNumber
                              : 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ram">
                            {singleVariantsById?.ram
                              ? singleVariantsById?.ram
                              : 'N/A'}{' '}
                            GB
                          </Descriptions.Item>
                          <Descriptions.Item label="Rom">
                            <Text>
                              {singleVariantsById?.rom
                                ? singleVariantsById?.rom
                                : 'N/A'}{' '}
                              GB
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Color">
                            <Text>
                              {singleVariantsById?.color
                                ? singleVariantsById?.color
                                : 'N/A'}
                            </Text>
                          </Descriptions.Item>
                        </Descriptions>
                      </>
                    )
                  ) : null}
                </div>
              ) : null}

              {/* {selectProduct !== '' ? (
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
              ) : null} */}
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Select supplier"
                name="supplier"
                rules={[
                  {
                    required: true,
                    message: 'Supplier selection is required.',
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
                  options={supplierOptions}
                />
              </Form.Item>

              {formData?.selectProduct !== '' ? (
                isCustomerLoading ? (
                  <Spin size="small" />
                ) : (
                  <>
                    <Descriptions
                      bordered
                      column={1}
                      size="small"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        margin: '20px auto',
                      }}
                      contentStyle={{ padding: '8px 16px' }}
                      labelStyle={{
                        padding: '8px 16px',
                        fontWeight: 'bold',
                      }}
                    >
                      <Descriptions.Item label="Name">
                        {`${
                          singleSupplierById?.firstName
                            ? singleSupplierById?.firstName
                            : ''
                        } ${
                          singleSupplierById?.middleName
                            ? singleSupplierById?.middleName
                            : ''
                        } ${
                          singleSupplierById?.lastName
                            ? singleSupplierById?.lastName
                            : ''
                        } ${
                          !singleSupplierById?.firstName &&
                          !singleSupplierById?.firstName
                            ? 'N/A'
                            : ''
                        }`}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone">
                        {singleSupplierById?.phoneNo
                          ? singleSupplierById?.phoneNo
                          : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {singleSupplierById?.email
                          ? singleSupplierById?.email
                          : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="NID">
                        {singleSupplierById?.nid
                          ? singleSupplierById?.nid
                          : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Address">
                        {singleSupplierById?.presentAddress
                          ? singleSupplierById?.presentAddress
                          : 'N/A'}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                )
              ) : null}
            </Col>

            {/* Total cell price */}
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Return amounts"
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
        <ReturnTable
          payloads={sellPayloads}
          setSellPayloads={setSellPayloads}
          singleSupplierById={singleSupplierById}
        />
      </div>
    </div>
  )
}

export default ReturnToSupplier
