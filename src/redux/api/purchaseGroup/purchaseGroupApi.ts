import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const PURCHASE_GROUP_URL = '/purchase-group'

export const purchaseGroupApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllPurchaseGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroup: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),

    getSinglePurchaseGroup: build.query({
      query: (id: string) => ({
        url: `${PURCHASE_GROUP_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchaseGroup],
    }),

    // Get purchase group by current date
    getPurchaseGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),
    // Get purchase group by current week
    getPurchaseGroupByCurrentWeek: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}/get-by-current-week`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),
    // Get purchase group by current month
    getPurchaseGroupByCurrentMonth: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}/get-by-current-month`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),

    // Get purchase group by current year
    getPurchaseGroupByCurrentYear: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}/get-by-current-year`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),

    // purchase group filter by start and end date
    purchaseGroupFilterByStartAndEndDate: build.query({
      query: ({
        startDate,
        endDate,
      }: {
        startDate: string
        endDate: string
      }) => ({
        url: `${PURCHASE_GROUP_URL}/filter-by-start-end-date`,
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),
  }),
})

export const {
  useGetSinglePurchaseGroupQuery,
  useGetPurchaseGroupByCurrentDateQuery,
  useGetPurchaseGroupByCurrentWeekQuery,
  useGetPurchaseGroupByCurrentMonthQuery,
  useGetPurchaseGroupByCurrentYearQuery,
  usePurchaseGroupFilterByStartAndEndDateQuery,
} = purchaseGroupApi
