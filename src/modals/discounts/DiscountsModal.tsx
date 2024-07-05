'use client'

import { useAddANewDiscountMutation } from '@/redux/api/discountApi/discountApi'
import { Form as AntdForm, Button, Col, Input, Modal, Row, message } from 'antd'
import { useEffect } from 'react'

type IDiscountsValues = {
  name: string
  discountType: string
  discountValue: number
}

const DiscountsModal = ({
  setIsDiscountsModal,
  isDiscountsModal,
  handleDiscountsOk,
  handleDiscountsCancel,
}: any) => {
  const [addANewDiscount] = useAddANewDiscountMutation()
  const [form] = AntdForm.useForm()

  const onFinish = async (values: IDiscountsValues) => {
    // @ts-ignore
    const discountValue = parseFloat(values.discountValue) // Parse discountValue as a float
    if (isNaN(discountValue)) {
      // Handle invalid input for discountValue
      message.error('Invalid discount value!')
      return
    }

    values.discountValue = discountValue // Update values with parsed discountValue
    // console.log(values)
    message.loading({ content: 'Creating discount...', key: 'creating' })

    try {
      const res = await addANewDiscount(values).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleDiscountsCancel() // Close the modal
        message.success('Discount added successfully!')
      } else {
        message.error('Discount added fail!')
      }
    } catch (error: any) {
      message.error('Discount added fail!')
      //   console.error('Error creating product:', error)
    } finally {
      message.destroy('creating')
      setIsDiscountsModal(false)
    }
  }

  useEffect(() => {
    if (!isDiscountsModal) {
      form.resetFields()
    }
  }, [isDiscountsModal, form])

  return (
    <>
      <Modal
        title="Create a new discount"
        open={isDiscountsModal}
        onOk={handleDiscountsOk}
        onCancel={handleDiscountsCancel}
        footer={null}
      >
        <AntdForm form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Discount name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Discount name is required.',
                  },
                  {
                    min: 1,
                    max: 15,
                    message:
                      'Discount name must be between 1 and 15 characters.',
                  },
                ]}
              >
                <Input size="large" maxLength={15} />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Discount type"
                name="discountType"
                rules={[
                  {
                    required: true,
                    message: 'Discount type is required.',
                  },
                  {
                    min: 1,
                    max: 10,
                    message:
                      'Discount type must be between 1 and 10 characters.',
                  },
                ]}
              >
                <Input size="large" maxLength={10} />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <AntdForm.Item
                label="Discount Value"
                name="discountValue"
                rules={[
                  {
                    required: true,
                    message: 'Discount value is required.',
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

export default DiscountsModal
