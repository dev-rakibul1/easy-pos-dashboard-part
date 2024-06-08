'use client'

import { useAddANewVatsMutation } from '@/redux/api/vatApi/vatApi'
import { Form as AntdForm, Button, Col, Input, Modal, Row, message } from 'antd'
import { useEffect } from 'react'

type IVats = {
  name: string
  vatType: string
  vatValue: number
}

const VatsModal = ({
  setIsVatsModal,
  isVatsModal,
  handleVatsOk,
  handleVatsCancel,
}: any) => {
  const [addANewVats] = useAddANewVatsMutation()
  const [form] = AntdForm.useForm()

  const onFinish = async (values: IVats) => {
    // @ts-ignore
    values.vatValue = parseFloat(values.vatValue)
    message.loading({ content: 'Creating vat...', key: 'creating' })

    try {
      const res = await addANewVats(values).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleVatsCancel() // Close the modal
        message.success('Vat added successfully!')
      } else {
        message.error('Vat added fail!')
      }
    } catch (error: any) {
      message.error('Vat added fail!')
      //   console.error('Error creating product:', error)
    } finally {
      message.destroy('creating')
      setIsVatsModal(false)
    }
  }

  useEffect(() => {
    if (!isVatsModal) {
      form.resetFields()
    }
  }, [isVatsModal, form])

  return (
    <>
      <Modal
        title="Create a new vat"
        open={isVatsModal}
        onOk={handleVatsOk}
        onCancel={handleVatsCancel}
        footer={null}
      >
        <AntdForm form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Vat name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Vat name is required.',
                  },
                  {
                    min: 1,
                    max: 15,
                    message: 'Vat name must be between 1 and 15 characters.',
                  },
                ]}
              >
                <Input size="large" maxLength={15} />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Vat type"
                name="vatType"
                rules={[
                  {
                    required: true,
                    message: 'Vat type is required.',
                  },
                  {
                    min: 1,
                    max: 10,
                    message: 'Vat type must be between 1 and 10 characters.',
                  },
                ]}
              >
                <Input size="large" maxLength={10} />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Vat Value"
                name="vatValue"
                rules={[
                  {
                    required: true,
                    message: 'Vat value is required.',
                  },
                ]}
              >
                <Input size="large" type="number" />
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

export default VatsModal
