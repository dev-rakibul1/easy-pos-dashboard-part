'use client'

import { colorPickerStyle } from '@/components/styles/style'
import { useAddANewColorMutation } from '@/redux/api/colorApi/colorApi'
import {
  Form as AntdForm,
  Button,
  Col,
  ColorPicker,
  Input,
  Modal,
  Row,
  message,
} from 'antd'
import { useEffect, useState } from 'react'

type IColorValues = {
  name: string
  colorCode: string
}

const ColorModal = ({
  setIsColorModal,
  isColorModal,
  handleColorOk,
  handleColorCancel,
}: any) => {
  const [addANewColor] = useAddANewColorMutation()
  const [form] = AntdForm.useForm()
  const [colorCode, setColorCode] = useState<string>('#1677ff')

  const onFinish = async (values: IColorValues) => {
    const finalValues = { ...values, colorCode }
    message.loading({ content: 'Creating color...', key: 'creating' })

    try {
      const res = await addANewColor(finalValues).unwrap()

      if (res) {
        form.resetFields() // Reset form fields after successful submission
        handleColorCancel() // Close the modal
        message.success('Color added successfully!')
      } else {
        message.error('Failed to add color!')
      }
    } catch (error: any) {
      message.error('Failed to add color!')
    } finally {
      message.destroy('creating')
      setIsColorModal(false)
    }
  }

  useEffect(() => {
    if (!isColorModal) {
      form.resetFields()
    }
  }, [isColorModal, form])

  return (
    <Modal
      title="Create a new color"
      open={isColorModal}
      onCancel={handleColorCancel}
      footer={null}
    >
      <AntdForm form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <AntdForm.Item
              label="Color name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Color name is required.',
                },
                {
                  min: 1,
                  max: 15,
                  message: 'Color name must be between 1 and 15 characters.',
                },
              ]}
            >
              <Input size="large" maxLength={15} />
            </AntdForm.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <AntdForm.Item
              label="Color code"
              name="colorCode"
              rules={[
                {
                  required: true,
                  message: 'Color code is required.',
                },
              ]}
            >
              <ColorPicker
                value={colorCode}
                onChange={(value, hex) => setColorCode(hex)}
                // @ts-ignore
                defaultColor="#1677ff"
                showText
                size="large"
                style={colorPickerStyle}
              />
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
  )
}

export default ColorModal
