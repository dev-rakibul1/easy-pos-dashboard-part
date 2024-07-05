'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputTextAreaFields from '@/components/form/InputTextArea'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
} from '@/redux/api/brandApi/brandApi'
import { UpdateBrandYupValidation } from '@/schemas/brandSchema/brandSchema'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type IBrandData = {
  brandName: string
  description?: string
}

const BrandEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleBrandQuery(id)
  const [updateBrand] = useUpdateBrandMutation()
  const router = useRouter()

  const onsubmit = async (values: IBrandData) => {
    message.loading({ content: 'Updating brand...', key: 'updating' })
    try {
      const res = await updateBrand({ id, body: values })

      if (res.data) {
        message.success('Brand updated success!')
        router.push(`/${role}/brand-lists`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    brandName: data?.brandName || '',
    description: data?.description || '',
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
            label: `Brand list`,
            link: `/${role}/brand-lists`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update brand details"></ActionBar>

      <Form
        submitHandler={onsubmit}
        resolver={yupResolver(UpdateBrandYupValidation)}
        defaultValues={defaultValue}
      >
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="brandName"
                size="large"
                label="Brand name"
              />
            </Col>
            <Col className="gutter-row" span={24} style={{ marginTop: '15px' }}>
              <InputTextAreaFields
                name="description"
                size="large"
                label="Description (optional)"
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

export default BrandEditPage
