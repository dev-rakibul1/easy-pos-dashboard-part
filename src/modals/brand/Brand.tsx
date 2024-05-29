'use client'

import { useAddANewBrandMutation } from '@/redux/api/brandApi/brandApi'
import { Form as AntdForm, Button, Col, Input, Modal, Row, message } from 'antd'
import { useEffect } from 'react'

type IBrand = {
  brandName: string
  description?: string
}

const BrandModal = ({
  setIsBrandModal,
  isBrandModal,
  handleBrandOk,
  handleBrandCancel,
}: any) => {
  const [addANewBrand] = useAddANewBrandMutation()
  const [form] = AntdForm.useForm()

  const onFinish = async (values: IBrand) => {
    message.loading({ content: 'Creating brand...', key: 'creating' })

    try {
      const res = await addANewBrand(values).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleBrandCancel() // Close the modal
        message.success('Brand added successfully!')
      } else {
        message.error('Brand added fail!')
      }
    } catch (error: any) {
      message.error('Brand added fail!')
      //   console.error('Error creating product:', error)
    } finally {
      message.destroy('creating')
      setIsBrandModal(false)
    }
  }

  useEffect(() => {
    if (!isBrandModal) {
      form.resetFields()
    }
  }, [isBrandModal, form])

  return (
    <>
      <Modal
        title="Create a new brand"
        open={isBrandModal}
        onOk={handleBrandOk}
        onCancel={handleBrandCancel}
        footer={null}
      >
        <AntdForm form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Brand name"
                name="brandName"
                rules={[
                  {
                    required: true,
                    message: 'Brand name is required.',
                  },
                ]}
              >
                <Input size="large" />
              </AntdForm.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item label="Description (optional)" name="description">
                <Input.TextArea style={{ minHeight: '15vh' }} />
              </AntdForm.Item>
            </Col>
          </Row>

          <AntdForm.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </AntdForm.Item>
        </AntdForm>
      </Modal>
    </>
  )
}

export default BrandModal
