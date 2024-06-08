'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import { color, discounts } from '@/constants/global'
import {
  useGetSinglePurchaseQuery,
  useUpdatePurchaseMutation,
} from '@/redux/api/purchaseApi/PurchaseApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

const PurchaseEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const { id } = params
  const { data } = useGetSinglePurchaseQuery(id)
  const [updateProduct] = useUpdatePurchaseMutation()
  const router = useRouter()

  const onSubmit = async (values: any) => {
    // Convert specific fields to numbers
    const fieldsToConvert = [
      'sellingPrice',
      'purchaseRate',
      'vats',
      'discounts',
    ]

    const convertedValues = { ...values }

    fieldsToConvert.forEach(field => {
      if (values[field] !== undefined) {
        convertedValues[field] = Number(values[field])
      }
    })

    console.log(convertedValues)

    message.loading({ content: 'Updating purchase...', key: 'updating' })
    try {
      const res = await updateProduct({ id, body: convertedValues })

      if (res.data) {
        message.success('Purchase updated successfully!')
        router.push(`/${role}/purchase-list`)
      } else {
        message.error('Purchase update failed!')
      }
      console.log(res)
    } catch (error: any) {
      message.error(error.message)
    }
  }

  // Default value
  const defaultValue = {
    vats: data?.vats || 0,
    discounts: data?.discounts || 0,
    sellingPrice: data?.sellingPrice || 0,
    purchaseRate: data?.purchaseRate || 0,
    ram: data?.ram || '',
    room: data?.room || '',
    color: data?.color || '',
  }

  return (
    <FormProvider {...methods}>
      <div>
        <PosBreadcrumb
          items={[
            {
              label: `${role}`,
              link: `/${role}`,
            },
            {
              label: `Purchase`,
              link: `/${role}/purchase-list`,
            },
            {
              label: `Edit`,
              link: `/${role}/purchase-list/edit/${params.id}`,
            },
          ]}
        />

        {/* Start Crate a brand */}
        <ActionBar title="Edit purchase" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form submitHandler={onSubmit} defaultValues={defaultValue}>
            <Row gutter={{ xs: 24, sm: 16, md: 24, lg: 24 }}>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="sellingPrice"
                  size="large"
                  label="Selling Price"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="purchaseRate"
                  size="large"
                  label="Purchase Rate"
                />
              </Col>
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
                  label="Color"
                  options={color}
                  size="large"
                />
              </Col>
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
                />
              </Col>
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
                  label="Discounts"
                  options={discounts}
                  size="large"
                />
              </Col>

              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput type="text" name="ram" size="large" label="Ram" />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput type="text" name="room" size="large" label="Room" />
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: '10px' }}
            >
              Updated
            </Button>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default PurchaseEditPage
