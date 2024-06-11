'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'

import { colorPickerStyle } from '@/components/styles/style'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleColorQuery,
  useUpdateColorMutation,
} from '@/redux/api/colorApi/colorApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Col, ColorPicker, Form, Input, Row, message } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type IColorValues = {
  name: string
  colorCode: string
}

const ColorEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params
  const { data } = useGetSingleColorQuery(id)
  const [updateColor] = useUpdateColorMutation()
  const router = useRouter()
  const [colorCode, setColorCode] = useState<string>('#1677ff')
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      setColorCode(data.colorCode)
      form.setFieldsValue({
        name: data.name,
        colorCode: data.colorCode,
      })
    }
  }, [data, form])

  const onFinish = async (values: IColorValues) => {
    const updatedValues = { ...values, colorCode }
    console.log(updatedValues)
    message.loading({ content: 'Updating color...', key: 'updating' })
    try {
      const res = await updateColor({ id, body: updatedValues })

      if (res.data) {
        message.success('Color updated successfully!')
        router.push(`/${role}/color-lists`)
      } else {
        message.error('Color update failed!')
      }
    } catch (error: any) {
      message.error(error.message)
    }
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
            label: `Color list`,
            link: `/${role}/color-lists`,
          },
          {
            label: `Edit`,
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update color" />

      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{ name: '', colorCode: '#1677ff' }}
        layout="vertical" // Use vertical layout to position labels on top
      >
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
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
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
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
                  size="large"
                  value={colorCode}
                  // @ts-ignore
                  onChange={(value: string, hex: string) => setColorCode(hex)}
                  defaultColor="#1677ff"
                  style={colorPickerStyle}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </div>
  )
}

export default ColorEditPage
