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
import { useEffect, useState } from 'react'

const { Text } = Typography
const { Item } = Form

type Variant = {
  imeiNumber: string
  ram: string
  rom: string
  color: string
  purchaseRate: string
  sellingPrice: string
  vats: string
  discounts: string
}

interface DynamicFormProps {
  count: number
  setOpenVariantModal: (isOpen: boolean) => void
  variants: Variant[]
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>
}

const DynamicForm = ({
  count,
  setOpenVariantModal,
  variants,
  setVariants,
}: DynamicFormProps) => {
  const [form] = Form.useForm()
  const [productColors, setProductColors] = useState<string[]>(
    Array(count).fill('')
  )

  useEffect(() => {
    const initialValues = Array.from({ length: count }, () => ({
      imeiNumber: '',
      ram: '',
      rom: '',
      color: '',
      purchaseRate: '',
      sellingPrice: '',
      vats: '',
      discounts: '',
    }))
    setVariants(initialValues)
  }, [count, setVariants])

  const handleFinish = () => {
    form.resetFields()
    setOpenVariantModal(false)
    message.success('Variant added successfully!')
  }

  const handleColorChange = (index: number, value: string) => {
    const newProductColors = [...productColors]
    newProductColors[index] = value
    setProductColors(newProductColors)

    const newFormData = [...variants]
    newFormData[index] = { ...newFormData[index], color: value }
    setVariants(newFormData)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  const handleInputChange = (
    index: number,
    fieldName: keyof Variant,
    value: string
  ) => {
    const newFormData = [...variants]
    newFormData[index] = { ...newFormData[index], [fieldName]: value }
    setVariants(newFormData)
  }

  const renderFormItems = () => {
    return variants.map((data, index) => (
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
                { required: true, message: 'Please input IMEI Number!' },
                {
                  pattern: /^(?!\s*$).+/,
                  message: 'Please enter a valid IMEI Number!',
                }, // Custom validation rule
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e =>
                  handleInputChange(index, 'imeiNumber', e.target.value)
                }
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`ram_${index}`}
              label="RAM"
              rules={[{ required: true, message: 'Please input RAM!' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e => handleInputChange(index, 'ram', e.target.value)}
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`rom_${index}`}
              label="ROM"
              rules={[{ required: true, message: 'Please input ROM!' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e => handleInputChange(index, 'rom', e.target.value)}
              />
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`purchaseRate_${index}`}
              label="Purchase Rate"
              rules={[
                { required: true, message: 'Please input Purchase Rate!' },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e =>
                  handleInputChange(index, 'purchaseRate', e.target.value)
                }
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`sellingPrice_${index}`}
              label="Selling Price"
              rules={[
                { required: true, message: 'Please input Selling Price!' },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e =>
                  handleInputChange(index, 'sellingPrice', e.target.value)
                }
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`vats_${index}`}
              label="Vats"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e => handleInputChange(index, 'vats', e.target.value)}
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Item
              name={`discounts_${index}`}
              label="Discounts"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                onChange={e =>
                  handleInputChange(index, 'discounts', e.target.value)
                }
              />
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
