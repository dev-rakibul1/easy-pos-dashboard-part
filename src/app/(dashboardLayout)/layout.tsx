'use client'

import Contents from '@/components/ui/Content'
import Sidebar from '@/components/ui/Sidebar'
import { isLoggedIn } from '@/services/auth.services'
import { Layout, Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const userLoggedIn = isLoggedIn()

  useEffect(() => {
    if (!userLoggedIn) {
      router.push('/login')
    }
    setIsLoading(true)
  }, [router, userLoggedIn, isLoading])

  if (!isLoading) {
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
        <div style={{ padding: '15px' }}>{children} </div>
      </Contents>
    </Layout>
  )
}

export default DashboardLayout
