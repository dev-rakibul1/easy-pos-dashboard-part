'use client'

import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import { useUserLoginMutation } from '@/redux/api/authApi'
import { storeUserInfo } from '@/services/auth.services'
import CustomButton from '@/utils/Button'
import { Col, Divider, Row, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { SubmitHandler } from 'react-hook-form'

const { Title } = Typography

type IFormValues = {
  uniqueId: string
  password: string
}

const LoginInfoPage = () => {
  const router = useRouter()
  const [userLogin] = useUserLoginMutation()

  // Login info
  const onSubmit: SubmitHandler<IFormValues> = async (data: any) => {
    try {
      const res = await userLogin({ ...data }).unwrap()
      // console.log('from login page', res)
      storeUserInfo(res)

      if (res?.accessToken) {
        router.push('/home')
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div>
      <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
        <Col
          sm={8}
          md={8}
          lg={8}
          style={{ border: '1px solid #ddd', padding: '15px' }}
        >
          <Form submitHandler={onSubmit}>
            <Title
              style={{
                textAlign: 'center',
                fontWeight: '400',
                fontSize: '25px',
              }}
              level={4}
            >
              Welcome from POS dashboard
            </Title>

            <Divider style={{ fontSize: '18px' }}>Login</Divider>

            {/* <div>
              <FormInput
                name="text"
                type="text"
                placeholder="uniqueId"
                size="large"
                label="Addon"
                addonAfter={<SettingOutlined onClick={handleSettingsClick} />}
              />
            </div> */}

            <div>
              <FormInput
                name="uniqueId"
                type="text"
                placeholder="uniqueId"
                size="large"
                label="Unique Id"
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <FormInput
                name="password"
                type="password"
                placeholder="Password"
                size="large"
                label="Password"
              />
            </div>

            <CustomButton htmlType="submit" type="primary">
              Login
            </CustomButton>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default LoginInfoPage
