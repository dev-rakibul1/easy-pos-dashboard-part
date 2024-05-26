import LoginInfoPage from '@/components/loginInfo/LoginInfoPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Easy POS',
  description: 'Easy pos for mobile shop | login page',
}
const LoginPage = () => {
  return (
    <div>
      <LoginInfoPage />
    </div>
  )
}

export default LoginPage
