'use client'

import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LoadingPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const decoded = getUserInfo() as ITokenObj

  const isTokenExpired = (decoded: ITokenObj) => {
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime > decoded.exp
  }

  const isTokenExpiredIn = isTokenExpired(decoded)

  useEffect(() => {
    if (isTokenExpiredIn === true) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [isTokenExpiredIn, router])

  if (isLoading) {
    return (
      <div
        style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
      >
        <Spin size="small" />
      </div>
    )
  }

  return null
}

export default LoadingPage
