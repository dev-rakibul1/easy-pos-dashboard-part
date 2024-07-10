import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const CUSTOMER_PURCHASE_URL = '/customer-purchase'

export const customerPurchasesApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getCustomerPurchasesByCustomerAndUser: build.query({
      query: (id: string) => ({
        url: `${CUSTOMER_PURCHASE_URL}/get-purchase-by-customer-and-user/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.customerPurchase],
    }),
    getSingleCustomerPurchase: build.query({
      query: (id: string) => ({
        url: `${CUSTOMER_PURCHASE_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.customerPurchase],
    }),
    // Get customer purchase by current date
    getCustomerPurchaseByCurrentDate: build.query({
      query: () => ({
        url: `${CUSTOMER_PURCHASE_URL}/get-by-current-date`,
        method: 'GET',
      }),

      providesTags: [tagTypes.customerPurchase],
    }),
  }),
})

export const {
  useGetCustomerPurchasesByCustomerAndUserQuery,
  useGetSingleCustomerPurchaseQuery,
  useGetCustomerPurchaseByCurrentDateQuery,
} = customerPurchasesApi
