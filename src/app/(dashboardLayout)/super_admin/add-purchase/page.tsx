'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import { color, discounts, product, supplier } from '@/constants/global'
import { CreatePurchaseYupSchema } from '@/schemas/purchaseSchema/CreatePurchaseSchema'
import { getUserInfo } from '@/services/auth.services'
import CustomButton from '@/utils/Button'
import { PlusOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'antd'
import { useForm } from 'react-hook-form'

type IPurchaseType = {
  purchaseRate: number
  sellingPrice: number
  discounts?: number
  vats?: number
  totalPrice: number
  totalStock?: number
  color?: number
  uniqueId: number
  userId?: string
  productId?: string
  supplierId?: string
}

const AddPurchase = () => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const onSubmit = async (data: IPurchaseType) => {
    try {
      console.log('from purchase page', data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Purchase`,
            link: `/${role}/add-purchase`,
          },
        ]}
      />
      <ActionBar title="Create a new purchase" />
      <div style={{ border: '1px solid #ddd', padding: '15px' }}>
        <Form
          submitHandler={onSubmit}
          resolver={yupResolver(CreatePurchaseYupSchema)}
        >
          <Row gutter={{ xs: 24, sm: 16, md: 24, lg: 24 }}>
            {/* Supplier */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <InputSelect
                name="supplierId"
                label="Supplier"
                options={supplier}
                size="large"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add new supplier')} />
                }
              />
            </Col>
            {/* product */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <InputSelect
                name="productId"
                label="Product"
                options={product}
                size="large"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add new supplier')} />
                }
              />
            </Col>

            {/* purchase Rate */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <FormInput
                type="number"
                name="purchaseRate"
                size="large"
                label="Purchase rate"
              />
            </Col>
            {/* selling Rate */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <FormInput
                type="number"
                name="sellingPrice"
                size="large"
                label="Selling price"
              />
            </Col>
            {/* discounts */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <InputSelect
                name="discounts"
                label="Discount"
                options={discounts}
                size="large"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add new supplier')} />
                }
              />
            </Col>
            {/* Vats */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <InputSelect
                name="vats"
                label="Vats"
                options={discounts}
                size="large"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add new supplier')} />
                }
              />
            </Col>
            {/* total Price */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <FormInput
                type="number"
                name="totalPrice"
                size="large"
                label="Total price"
              />
            </Col>
            {/* Colors */}
            <Col
              style={{ marginTop: '15px' }}
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <InputSelect
                name="color"
                options={color}
                size="large"
                label="Color"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add new color')} />
                }
              />
            </Col>
          </Row>
          <CustomButton type="primary" htmlType="submit">
            Add to card
          </CustomButton>
        </Form>
      </div>
    </div>
  )
}

export default AddPurchase
