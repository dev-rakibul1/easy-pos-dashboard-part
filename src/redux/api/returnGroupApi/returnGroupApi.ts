import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const RETURN_GROUP_URL = '/return-group'

export const returnGroupApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllReturnGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_GROUP_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returnGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.returnGroup],
    }),

    getSingleReturnGroup: build.query({
      query: (id: string) => ({
        url: `${RETURN_GROUP_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.returnGroup],
    }),

    getAllReturnGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_GROUP_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returnGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.returnGroup],
    }),
    getAllReturnGroupByCurrentWeek: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_GROUP_URL}/get-by-current-week`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returnGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.returnGroup],
    }),
    getAllReturnGroupByCurrentMonth: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_GROUP_URL}/get-by-current-month`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returnGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.returnGroup],
    }),
    getAllReturnGroupByCurrentYear: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${RETURN_GROUP_URL}/get-by-current-year`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          returnGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.returnGroup],
    }),
  }),
})

export const {
  useGetAllReturnGroupQuery,
  useGetSingleReturnGroupQuery,
  useGetAllReturnGroupByCurrentDateQuery,
  useGetAllReturnGroupByCurrentWeekQuery,
  useGetAllReturnGroupByCurrentMonthQuery,
  useGetAllReturnGroupByCurrentYearQuery,
} = returnGroupApi
