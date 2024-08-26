'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import ActionBar from '@/components/ui/ActionBar'
import UploadImage from '@/components/ui/UploadImage'
import { useAddANewCustomerMutation } from '@/redux/api/customerApi/customerApi'
import { CreateCustomerYupSchema } from '@/schemas/customerSchemes/customerScheme'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'
import { FormProvider, useForm } from 'react-hook-form'

export type ICreateCustomerFormData = {
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNo: number | string
  nid?: number | null | string
  presentAddress?: string | null
  permanentAddress?: string | null
  file?: File | null
}

const AddCustomers = () => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const [addANewCustomer] = useAddANewCustomerMutation()

  const onSubmit = async (values: ICreateCustomerFormData) => {
    values.phoneNo = String(values.phoneNo)
    values.nid = String(values.nid)
    const obj = { ...values }
    const file = obj['file']
    delete obj['file']
    const data = JSON.stringify(obj)
    const formData = new FormData()
    formData.append('file', file as Blob)
    formData.append('data', data)

    try {
      message.loading({ content: 'Add customer...', key: 'adding' })
      const res = await addANewCustomer(formData)
      if (res.data) {
        message.success({
          content: 'Customer added successfully!',
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
    <FormProvider {...methods}>
      <div>
        <PosBreadcrumb
          items={[
            {
              label: `${role}`,
              link: `/${role}`,
            },
            {
              label: `Customers`,
              link: `/${role}/add-customers`,
            },
          ]}
        />
        <ActionBar title="Create a new customer" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(CreateCustomerYupSchema)}
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
                  required
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
                  required
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
                <FormInput
                  required
                  type="text"
                  name="email"
                  size="large"
                  label="Email"
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
                  required
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
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: '15px' }}
            >
              Add customer
            </Button>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default AddCustomers
