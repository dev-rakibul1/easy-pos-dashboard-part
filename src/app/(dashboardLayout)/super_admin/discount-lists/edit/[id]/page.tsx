'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleDiscountQuery,
  useUpdateDiscountMutation,
} from '@/redux/api/discountApi/discountApi'
import {} from '@/schemas/unitSchema/unitSchema'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type IDiscountsValues = {
  name: string
  discountType: string
  discountValue: number
}

const EditDiscountPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleDiscountQuery(id)
  const [updateDiscount] = useUpdateDiscountMutation()
  const router = useRouter()

  const onsubmit = async (values: IDiscountsValues) => {
    // console.log('first')

    // @ts-ignore
    values.discountValue = parseFloat(values.discountValue)
    // console.log(values)
    message.loading({ content: 'Updating discount...', key: 'updating' })
    try {
      const res = await updateDiscount({ id, body: values })

      if (res.data) {
        message.success('Discount updated success!')
        router.push(`/${role}/discount-lists`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    name: data?.name || '',
    discountType: data?.discountType || '',
    discountValue: data?.discountValue || 0,
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
            label: `Discount list`,
            link: `/${role}/discount-lists`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/discount-lists/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update discount"></ActionBar>

      <Form
        submitHandler={onsubmit}
        // resolver={yupResolver(UpdateVatsYupValidation)}
        defaultValues={defaultValue}
      >
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="name"
                size="large"
                label="Discount name"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="discountType"
                size="large"
                label="Discount Type"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="number"
                name="discountValue"
                size="large"
                label="Discount value"
              />
            </Col>
          </Row>
        </div>

        <Button type="primary" htmlType="submit">
          Updated
        </Button>
      </Form>
    </div>
  )
}

export default EditDiscountPage
