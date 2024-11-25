import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const SELLS_URL = '/sell'

// video no 52.12

export const sellsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new sell
    addANewSells: build.mutation({
      query: data => ({
        url: `${SELLS_URL}/create-sell/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.sell],
    }),
    // Create a new sell
    getSellByCurrentDate: build.query({
      query: () => ({
        url: `${SELLS_URL}/get-sell-by-current-date/`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),

    // Create a new sell
    getSellByCustomerPurchaseId: build.query({
      query: (id: string) => ({
        url: `${SELLS_URL}/sell-get-by-customer-purchase-product-id/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),
    // get all sell depended current week
    getSellByCurrentWeek: build.query({
      query: () => ({
        url: `${SELLS_URL}/get-sell-by-current-week`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),
    // get all sell depended current month
    getSellByCurrentMonth: build.query({
      query: () => ({
        url: `${SELLS_URL}/get-sell-by-current-month/`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),
    // get all sell depended current year
    getSellByCurrentYear: build.query({
      query: () => ({
        url: `${SELLS_URL}/get-sell-by-current-year/`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),

    // get single sell api
    getSingleSell: build.query({
      query: (id: string) => ({
        url: `${SELLS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),

    // get sell by imei number api
    getSellByImeiNumber: build.query({
      query: (id: string) => ({
        url: `${SELLS_URL}/warranty/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.sell],
    }),

    // loss sell group filter by start and end date
    sellsLossFilterByStartAndEndDate: build.query({
      query: ({
        startDate,
        endDate,
      }: {
        startDate: string
        endDate: string
      }) => ({
        url: `${SELLS_URL}/filter-loss-by-start-end-date`,
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sells: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sell],
    }),
    // loss sell group filter by start and end date
    sellsProfitFilterByStartAndEndDate: build.query({
      query: ({
        startDate,
        endDate,
      }: {
        startDate: string
        endDate: string
      }) => ({
        url: `${SELLS_URL}/filter-profit-by-start-end-date`,
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sells: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sell],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewSellsMutation,
  useGetSellByCurrentDateQuery,
  useGetSellByCustomerPurchaseIdQuery,
  useGetSellByCurrentWeekQuery,
  useGetSellByCurrentMonthQuery,
  useGetSellByCurrentYearQuery,
  useGetSingleSellQuery,
  useGetSellByImeiNumberQuery,
  useSellsLossFilterByStartAndEndDateQuery,
  useSellsProfitFilterByStartAndEndDateQuery,
} = sellsApi
