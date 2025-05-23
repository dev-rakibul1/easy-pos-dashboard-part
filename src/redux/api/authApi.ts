import { tagTypes } from '../tags/tagTypes'
import { baseApi } from './baseApi'

const AUTH_URL = '/auth'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    userLogin: build.mutation({
      query: loginData => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        data: loginData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
  overrideExisting: false,
})

export const { useUserLoginMutation } = authApi
