import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const RETURN_URL = '/return'

export const returnApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewReturn: build.mutation({
      query: data => ({
        url: `${RETURN_URL}/return-product`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.return],
    }),

    getAllReturns: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returns: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.return],
    }),
    getAllReturnsByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returns: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.return],
    }),
    getAllReturnsByCurrentWeek: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_URL}/get-by-current-week`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returns: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.return],
    }),
    getAllReturnsByCurrentMonth: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_URL}/get-by-current-month`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returns: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.return],
    }),
  }),
})

export const {
  useAddANewReturnMutation,
  useGetAllReturnsByCurrentDateQuery,
  useGetAllReturnsByCurrentWeekQuery,
  useGetAllReturnsByCurrentMonthQuery,
} = returnApi
