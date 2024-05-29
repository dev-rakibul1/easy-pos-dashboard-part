'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import UploadImage from '@/components/ui/UploadImage'
import { gender } from '@/constants/global'
import { CreateUserYupSchema } from '@/schemas/userSchema/userSchema'
import { getUserInfo } from '@/services/auth.services'
import CustomButton from '@/utils/Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'antd'
import { FormProvider, useForm } from 'react-hook-form'

const AddUsers = () => {
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
            {
              label: `Users`,
              link: `/${role}/add-users`,
            },
          ]}
        />
        <ActionBar title="Create a new user" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(CreateUserYupSchema)}
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
                <FormInput
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
                <FormInput
                  type="text"
                  name="password"
                  size="large"
                  label="Password default (user12345)"
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
                <UploadImage />
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

export default AddUsers
