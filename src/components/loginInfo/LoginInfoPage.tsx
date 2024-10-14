'use client'

import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import { useUserLoginMutation } from '@/redux/api/authApi'
import { CreateLoginAuthValidation } from '@/schemas/authSchema/login'
import { storeUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Divider, Row, Typography, message, theme } from 'antd'
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
  const { token } = theme.useToken();

  // Login info
  const onSubmit: SubmitHandler<IFormValues> = async (data: any) => {
    try {
      const res = await userLogin({ ...data }).unwrap()
      storeUserInfo(res)

      if (res?.accessToken) {
        message.success('Login success!')
        router.push('/home')
      } else {
        message.error('Login fail!')
      }
    } catch (error: any) {
      // console.error(error.message)
      message.error('Invalid unique id and password.')
    }
  }

  return (
    <div>
      <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
        <Col
          sm={8}
          md={8}
          lg={8}
          style={{
            border: `1px solid ${token.colorBorder}`,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(CreateLoginAuthValidation)}
          >
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

            <div>
              <FormInput
                name="uniqueId"
                type="text"
                placeholder="uniqueId"
                size="large"
                label="Unique Id"
                required
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <FormInput
                name="password"
                type="password"
                placeholder="Password"
                size="large"
                label="Password"
                required
              />
            </div>

            <Button htmlType="submit" type="primary">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default LoginInfoPage
