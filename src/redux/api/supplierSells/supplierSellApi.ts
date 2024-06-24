import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SUPPLIER_SELLS_URL = '/supplier-sell'

export const supplierSellsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getSupplierSellsBySupplierAndUser: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_SELLS_URL}/get-sell-by-supplier-and-user/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierSells],
    }),
    getSingleSupplierSell: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_SELLS_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierSells],
    }),
  }),
})

export const {
  useGetSupplierSellsBySupplierAndUserQuery,
  useGetSingleSupplierSellQuery,
} = supplierSellsApi
