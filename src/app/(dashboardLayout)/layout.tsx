'use client'

import Contents from '@/components/ui/Content'
import Sidebar from '@/components/ui/Sidebar'
import { authKey } from '@/constants/storageKey'
import { getUserInfo, isLoggedIn } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { Layout, Spin, theme } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = theme.useToken()

  useEffect(() => {
    const decoded = getUserInfo() as ITokenObj | null

    if (!decoded || !isLoggedIn()) {
      localStorage.removeItem(authKey)
      router.push('/login')
      return
    }

    const isTokenExpired = (decoded: ITokenObj) => {
      const currentTime = Math.floor(Date.now() / 1000)
      return currentTime > decoded.exp
    }

    if (isTokenExpired(decoded)) {
      localStorage.removeItem(authKey)
      router.push('/login')
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div
        style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
      >
        <Spin size="small" />
      </div>
    )
  }

  return (
    <Layout hasSider>
      <Sidebar />
      <Contents>
        <div style={{ padding: '15px' }}>{children}</div>
      </Contents>
    </Layout>
  )
}

export default DashboardLayout
