'use client'

import { authKey } from '@/constants/storageKey'
import { decodedToken } from '@/utils/jwt-decode'
import { getFromLocalStorage, setToLocalStorage } from '@/utils/local-storage'

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  // console.log(accessToken)
  setToLocalStorage(authKey, accessToken)
}

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey)
  if (authToken) {
    const decodedInfo = decodedToken(authToken)
    return decodedInfo
  } else {
    return ''
  }
}

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey)
  return !!authToken
}
export const isLoggedOut = (key: string) => {
  return localStorage.removeItem(key)
}
