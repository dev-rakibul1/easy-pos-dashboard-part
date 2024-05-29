'use client'

import { useAddANewCategoryMutation } from '@/redux/api/categoryApi/categoryApi'
import { Button, Col, Form, Input, Modal, Row, message } from 'antd'
import { useEffect } from 'react'

type ICategory = {
  categoryName: string
}

const CategoryModals = ({
  setIsCategoryModal,
  isCategoryModal,
  handleCategoryOk,
  handleCategoryCancel,
}: any) => {
  const [addANewCategory] = useAddANewCategoryMutation()
  const [form] = Form.useForm()

  const onFinish = async (values: ICategory) => {
    message.loading({ content: 'Creating category...', key: 'creating' })

    try {
      const res = await addANewCategory(values).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleCategoryCancel() // Close the modal
        message.success('Category added successfully!')
      } else {
        message.error('Category added fail!')
      }
    } catch (error: any) {
      message.error('Category added fail!')
    } finally {
      message.destroy('creating')
      setIsCategoryModal(false)
    }
  }

  useEffect(() => {
    if (!isCategoryModal) {
      form.resetFields()
    }
  }, [isCategoryModal, form])

  return (
    <>
      <Modal
        title="Create a new Category"
        open={isCategoryModal}
        onOk={handleCategoryOk}
        onCancel={handleCategoryCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Category name"
                name="categoryName"
                rules={[
                  {
                    required: true,
                    message: 'Category name is required.',
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CategoryModals
