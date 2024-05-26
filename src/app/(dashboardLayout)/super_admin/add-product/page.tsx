'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import CustomButton from '@/utils/Button'
import { PlusOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'

const AddProduct = () => {
  const { role } = getUserInfo() as any

  const onSubmit = async (data: any) => {
    try {
      console.log('from login page', data)
    } catch (error: any) {
      console.error(error.message)
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
          // {
          //   label: `user`,
          //   link: `/${role}/user`,
          // },
        ]}
      />
      <ActionBar title="Create a new product"></ActionBar>

      {/* Create a new product form */}
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
              <FormInput
                type="text"
                name="brandName"
                size="large"
                label="Brand name"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add brand popup')} />
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
              <FormInput
                type="text"
                name="unit"
                size="large"
                label="Unit"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add unit popup')} />
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
                name="category"
                size="large"
                label="Category"
                addonAfter={
                  <PlusOutlined onClick={() => alert('Add category popup')} />
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
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <FormInput
                type="text"
                name="description"
                size="large"
                label="Description"
              />
            </Col>
          </Row>
          <CustomButton type="primary" htmlType="submit">
            Submit
          </CustomButton>
        </Form>
      </div>
    </div>
  )
}

export default AddProduct
