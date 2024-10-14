import LoginInfoPage from '@/components/loginInfo/LoginInfoPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LOGIN | EASY POS',
  description: 'Easy POS for mobile shop | login page',
}
const LoginPage = () => {
  return (
    <div>
      <LoginInfoPage />
    </div>
  )
}

export default LoginPage
