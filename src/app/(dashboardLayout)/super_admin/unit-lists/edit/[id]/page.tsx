'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
} from '@/redux/api/unitApi/unitApi'
import { UpdateUnitYupValidation } from '@/schemas/unitSchema/unitSchema'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type IUnitsData = {
  unitName: string
}

const UnitEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleUnitQuery(id)
  const [updateUnit] = useUpdateUnitMutation()
  const router = useRouter()

  const onsubmit = async (values: IUnitsData) => {
    message.loading({ content: 'Updating unit...', key: 'updating' })
    try {
      const res = await updateUnit({ id, body: values })

      if (res.data) {
        message.success('Unit updated success!')
        router.push(`/${role}/unit-lists`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    unitName: data?.unitName || '',
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
            label: `Unit list`,
            link: `/${role}/unit-lists`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update unit name"></ActionBar>

      <Form
        submitHandler={onsubmit}
        resolver={yupResolver(UpdateUnitYupValidation)}
        defaultValues={defaultValue}
      >
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="unitName"
                size="large"
                label="Unit name"
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

export default UnitEditPage
