'use client'

import { authKey } from '@/constants/storageKey'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { Spin } from 'antd'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LoadingPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const decoded = getUserInfo() as ITokenObj

  const isTokenExpired = (decoded: ITokenObj) => {
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime > decoded.exp
  }

  const isTokenExpiredIn = isTokenExpired(decoded)

  // console.log(isTokenExpiredIn)

  useEffect(() => {
    if (isTokenExpiredIn !== true) {
      return (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      )
    } else {
      return redirect('/login')
    }
    setIsLoading(true)
  }, [router, isLoading, isTokenExpiredIn])

  
}

export default LoadingPage
