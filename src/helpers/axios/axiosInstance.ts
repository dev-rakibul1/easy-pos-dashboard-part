import { authKey } from '@/constants/storageKey'
import { IGenericErrorResponse, IResponseSuccessType } from '@/types'
import { getFromLocalStorage } from '@/utils/local-storage'
import axios from 'axios'

const instance = axios.create()

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers['Accept'] = 'application/json'
instance.defaults.timeout = 60000

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const accessToken = getFromLocalStorage(authKey)
    if (accessToken) {
      config.headers.Authorization = accessToken
    }

    return config
  },
  function (error) {
    return error
    // Do something with request error
    // return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  // @ts-ignore
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    const responseObject: IResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    }

    return responseObject
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const responseObject: IGenericErrorResponse = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || 'Something went wrong.',
      errorMessages: error?.response?.data?.errorMessages || [],
      messageType: error?.response?.data?.errorMessages || [],
      success: error?.response?.data?.success || false,
      error: error?.response,
    }

    return {
      // message: responseObject,
      error: Promise.reject({ responseObject }),
      // error_22: error,
    }

    // return Promise.reject(error)
  }
)

export { instance }
