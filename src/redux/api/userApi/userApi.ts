import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const USER_URL = '/user'

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewUser: build.mutation({
      query: data => ({
        url: `${USER_URL}/create-user/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    getAllUser: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${USER_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          users: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.user],
    }),

    getSingleUser: build.query({
      query: (id: string) => ({
        url: `${USER_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.user],
    }),

    updateUser: build.mutation({
      query: data => ({
        url: `${USER_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `${USER_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
})

export const { useGetSingleUserQuery } = userApi
