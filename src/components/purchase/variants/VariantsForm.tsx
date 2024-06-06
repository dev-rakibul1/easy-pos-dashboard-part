import { inputFormStyle, inputPlusBtnStyle } from '@/components/styles/style'
import { color } from '@/constants/global'
import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd'
import { useState } from 'react'

const { Text } = Typography
const { Item } = Form

const DynamicForm = ({
  count,
  onFormSubmit,
  setOpenVariantModal,
  productId,
}: any) => {
  const [form] = Form.useForm()
  const [productColors, setProductColors] = useState<string[]>(
    Array(count).fill('')
  )

  const handleFinish = (values: any) => {
    const groupedValues = Array.from({ length: count }, (_, index) => ({
      imeiNumber: values[`imeiNumber_${index}`],
      ram: values[`ram_${index}`],
      rom: values[`rom_${index}`],
      color: productColors[index],
      productId: productId,
    }))
    onFormSubmit(groupedValues)
    form.resetFields()
    setOpenVariantModal(false)
    message.success('Variant added successfully!')
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleColorChange = (index: number, value: string) => {
    const newProductColors = [...productColors]
    newProductColors[index] = value
    setProductColors(newProductColors)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  const renderFormItems = () => {
    return Array.from({ length: count }, (_, index) => (
      <Row
        gutter={16}
        key={index}
        style={{ border: '1px solid #ddd', marginTop: '15px', padding: '10px' }}
      >
        <Text strong>Variant - {index + 1}</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`imeiNumber_${index}`}
              label="IMEI Number"
              rules={[
                { required: true, message: 'Require IMEI Number!' },
                {
                  pattern: /^(?!\s*$).+/,
                  message: 'Please enter a valid IMEI Number!',
                }, // Custom validation rule
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`ram_${index}`}
              label="RAM"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`rom_${index}`}
              label="ROM"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`color_${index}`}
              label="Color"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <div style={inputFormStyle}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={value => handleColorChange(index, value)}
                  onSearch={onSearch}
                  style={{ width: '100%' }}
                  filterOption={filterOption}
                  options={color}
                  value={productColors[index]} // Ensure the Select component displays the correct color
                ></Select>
                <div style={inputPlusBtnStyle}>
                  <PlusOutlined />
                </div>
              </div>
            </Item>
          </Col>
        </div>
      </Row>
    ))
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Form form={form} name="dynamic_form" onFinish={handleFinish}>
          {renderFormItems()}
          <Row style={{ marginTop: '15px' }}>
            <Col xs={24}>
              <Item>
                <Button type="primary" htmlType="submit">
                  Add variants
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Space>
    </div>
  )
}

export default DynamicForm
