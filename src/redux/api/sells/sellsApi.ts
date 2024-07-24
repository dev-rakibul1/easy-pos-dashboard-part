import { tagTypes } from '@/redux/tags/tagTypes'
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
} = sellsApi
