'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import UploadImage from '@/components/ui/UploadImage'
import { gender, UserRoleArray } from '@/constants/global'
import { useAddANewUserMutation } from '@/redux/api/userApi/userApi'
import { CreateUserYupSchema } from '@/schemas/userSchema/userSchema'
import { getUserInfo } from '@/services/auth.services'
import { UserRole } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, message, Row } from 'antd'
import { FormProvider, useForm } from 'react-hook-form'

type IUserValues = {
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNo: number | string
  nid?: number | null | string
  presentAddress?: string | null
  permanentAddress?: string | null
  file?: File | null
  role?: UserRole
  password: string
}

const AddUsers = () => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const [addANewUser] = useAddANewUserMutation()

  const onSubmit = async (values: IUserValues) => {
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
      message.loading({ content: 'Add user...', key: 'adding' })
      const res = await addANewUser(formData)
      if (res.data) {
        message.success({
          content: 'User added successfully!',
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
                <InputSelect
                  name="role"
                  label="Role"
                  options={UserRoleArray}
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
                <UploadImage name="file" />
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Create user
            </Button>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default AddUsers
