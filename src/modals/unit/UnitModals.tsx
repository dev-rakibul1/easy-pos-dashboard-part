'use client'

import { useAddANewUnitMutation } from '@/redux/api/unitApi/unitApi'
import { Button, Col, Form, Input, Modal, Row, message } from 'antd'
import { useEffect } from 'react'

type IUnit = {
  unitName: string
}

const UnitModals = ({
  setIsUnitModal,
  isUnitModal,
  handleUnitOk,
  handleUnitCancel,
}: any) => {
  const [addANewUnit] = useAddANewUnitMutation()
  const [form] = Form.useForm()

  const onFinish = async (values: IUnit) => {
    message.loading({ content: 'Creating unit...', key: 'creating' })

    try {
      const res = await addANewUnit(values).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleUnitCancel() // Close the modal
        message.success('Unit added successfully!')
      } else {
        message.error('Unit added fail!')
      }
    } catch (error: any) {
      message.error('Unit added fail!')
      //   console.error('Error creating product:', error)
    } finally {
      message.destroy('creating')
      setIsUnitModal(false)
    }
  }

  useEffect(() => {
    if (!isUnitModal) {
      form.resetFields()
    }
  }, [isUnitModal, form])

  return (
    <>
      <Modal
        title="Create a new Unit"
        open={isUnitModal}
        onOk={handleUnitOk}
        onCancel={handleUnitCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Unit name"
                name="unitName"
                rules={[
                  {
                    required: true,
                    message: 'Unit name is required.',
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

export default UnitModals
