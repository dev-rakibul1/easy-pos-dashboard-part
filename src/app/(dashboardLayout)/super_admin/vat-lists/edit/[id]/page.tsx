'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleVatsQuery,
  useUpdateVatsMutation,
} from '@/redux/api/vatApi/vatApi'
import {} from '@/schemas/unitSchema/unitSchema'
import { UpdateVatsYupValidation } from '@/schemas/vatSchema/vatSchema'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type IVatsValues = {
  name: string
  vatType: string
  vatValue: number
}

const EditVatPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleVatsQuery(id)
  const [updateVats] = useUpdateVatsMutation()
  const router = useRouter()

  const onsubmit = async (values: IVatsValues) => {
    message.loading({ content: 'Updating vat...', key: 'updating' })
    try {
      const res = await updateVats({ id, body: values })

      if (res.data) {
        message.success('Vat updated success!')
        router.push(`/${role}/vat-lists`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    name: data?.name || '',
    vatType: data?.vatType || '',
    vatValue: data?.vatValue || 0,
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
            label: `vat list`,
            link: `/${role}/vat-lists`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update vat"></ActionBar>

      <Form
        submitHandler={onsubmit}
        resolver={yupResolver(UpdateVatsYupValidation)}
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
                label="Vat name"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="vatType"
                size="large"
                label="Vat Type"
              />
            </Col>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="number"
                name="vatValue"
                size="large"
                label="Vat value"
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

export default EditVatPage
