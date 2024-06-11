'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import UploadImage from '@/components/ui/UploadImage'
import { gender } from '@/constants/global'
import { useAddANewSupplierMutation } from '@/redux/api/supplierApi/supplierApi'
import CreateSupplierYupSchema from '@/schemas/supplierSchema/supplier'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'

const SupplierPage = () => {
  const { role } = getUserInfo() as any
  const [addANewSupplier] = useAddANewSupplierMutation()

  const onSubmit = async (values: any) => {
    // console.log(values)
    const obj = { ...values }
    const file = obj['file']
    delete obj['file']
    const data = JSON.stringify(obj)
    const formData = new FormData()
    formData.append('file', file as Blob)
    formData.append('data', data)
    // console.log(file)
    try {
      message.loading({ content: 'Add supplier...', key: 'adding' })
      const res = await addANewSupplier(formData)
      if (res.data) {
        message.success({
          content: 'Supplier added successfully!',
          key: 'adding',
          duration: 2,
        })
      } else {
        message.error({
          content: 'Added failed!',
          key: 'adding',
          duration: 2,
        })
      }
      //  console.log(res)
      // console.log('from login page', data)
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
          {
            label: `Supplier`,
            link: `/${role}/add-supplier`,
          },
        ]}
      />
      <ActionBar title="Create a new supplier" />
      <div style={{ border: '1px solid #ddd', padding: '15px' }}>
        <Form
          submitHandler={onSubmit}
          resolver={yupResolver(CreateSupplierYupSchema)}
        >
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
                name="firstName"
                size="large"
                label="First name"
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
                name="middleName"
                size="large"
                label="Middle name"
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
                name="lastName"
                size="large"
                label="Last name"
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
              <FormInput type="text" name="email" size="large" label="Email" />
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
                name="gender"
                label="Gender"
                options={gender}
                size="large"
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
                name="phoneNo"
                size="large"
                label="Number"
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
                name="nid"
                size="large"
                label="NID number"
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
                name="presentAddress"
                size="large"
                label="Present Address"
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
                name="permanentAddress"
                size="large"
                label="permanent Address"
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
              <UploadImage name="file" />
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Created
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default SupplierPage
