import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const SELL_GROUP_URL = '/sell-group'

export const sellGroupApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllSellGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),

    // Get sell group by current date
    getSellGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),
    // Get sell group by current date
    getSellGroupByCurrentWeek: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}/get-by-current-week`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),
    // Get sell group by current month
    getSellGroupByCurrentMonth: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}/get-by-current-month`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),
    // Get sell group by current year
    getSellGroupByCurrentYear: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}/get-by-current-year`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),

    getSingleSellGroup: build.query({
      query: (id: string) => ({
        url: `${SELL_GROUP_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchaseGroup],
    }),
    // Get by own id
    getSingleSellGroupByOwnId: build.query({
      query: (id: string) => ({
        url: `${SELL_GROUP_URL}/get-by-own-id/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchaseGroup],
    }),

    // Sell group filter by start and end date
    sellGroupFilterByStartAndEndDate: build.query({
      query: ({
        startDate,
        endDate,
      }: {
        startDate: string
        endDate: string
      }) => ({
        url: `${SELL_GROUP_URL}/filter-by-start-end-date`,
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),
  }),
})

export const {
  useGetAllSellGroupQuery,
  useGetSingleSellGroupQuery,
  useGetSellGroupByCurrentDateQuery,
  useGetSellGroupByCurrentWeekQuery,
  useGetSellGroupByCurrentMonthQuery,
  useGetSellGroupByCurrentYearQuery,
  useGetSingleSellGroupByOwnIdQuery,
  useSellGroupFilterByStartAndEndDateQuery,
} = sellGroupApi
