'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import { brandName } from '@/constants/global'
import { getUserInfo } from '@/services/auth.services'
import CustomButton from '@/utils/Button'
import { PlusOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import dynamic from 'next/dynamic'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import 'suneditor/dist/css/suneditor.min.css'

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false })

const FormSunEditor = ({ name, label }: any) => {
  const { control } = useFormContext()

  return (
    <div style={{ marginBottom: '24px' }}>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <SunEditor
            defaultValue={value}
            onChange={onChange}
            setOptions={{
              buttonList: [
                ['undo', 'redo', 'bold', 'italic', 'underline', 'list'],
                ['link', 'image', 'video'],
                ['font', 'fontSize', 'formatBlock'],
              ],
            }}
            height="200px"
          />
        )}
      />
    </div>
  )
}

const AddProduct = () => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const onSubmit = async (data: any) => {
    try {
      console.log('from login page', data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <FormProvider {...methods}>
      <div>
        <PosBreadcrumb
          items={[
            {
              label: `${role}`,
              link: `/${role}`,
            },
          ]}
        />
        <ActionBar title="Create a new product" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form submitHandler={onSubmit}>
            <Row gutter={{ xs: 24, sm: 16, md: 24, lg: 24 }}>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="productName"
                  size="large"
                  label="Product name"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="brandName"
                  label="Brand name"
                  options={brandName}
                  size="large"
                  addonAfter={
                    <PlusOutlined onClick={() => alert('Add new category')} />
                  }
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="modelName"
                  size="large"
                  label="Model name"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="processor"
                  size="large"
                  label="Processor"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="unit"
                  label="Unit"
                  options={brandName}
                  size="large"
                  addonAfter={
                    <PlusOutlined onClick={() => alert('Add new category')} />
                  }
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="category"
                  label="Category"
                  options={brandName}
                  size="large"
                  addonAfter={
                    <PlusOutlined onClick={() => alert('Add new category')} />
                  }
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="number"
                  name="reOrderAlert"
                  size="large"
                  label="Re-order alert"
                />
              </Col>

              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="productImage"
                  size="large"
                  label="Product Image"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <FormSunEditor name="description" label="Description" />
              </Col>
            </Row>
            <CustomButton type="primary" htmlType="submit">
              Submit
            </CustomButton>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default AddProduct
