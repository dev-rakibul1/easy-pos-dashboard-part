'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from '@/redux/api/categoryApi/categoryApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type ICategory = {
  categoryName: string
}

const CategoryEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleCategoryQuery(id)
  const [updateCategory] = useUpdateCategoryMutation()
  const router = useRouter()

  const onsubmit = async (values: ICategory) => {
    message.loading({ content: 'Updating category...', key: 'updating' })
    try {
      const res = await updateCategory({ id, body: values })

      if (res.data) {
        message.success('category updated success!')
        router.push(`/${role}/category-lists`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    categoryName: data?.categoryName || '',
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
            label: `Category list`,
            link: `/${role}/category-lists`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update category details"></ActionBar>

      <Form submitHandler={onsubmit} defaultValues={defaultValue}>
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="text"
                name="categoryName"
                size="large"
                label="Category name"
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

export default CategoryEditPage
