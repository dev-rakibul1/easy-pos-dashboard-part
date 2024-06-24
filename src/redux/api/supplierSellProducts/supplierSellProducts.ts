import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SUPPLIER_SELLS_URL = '/supplier-sell-products'

export const supplierSellProductApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getSupplierSellProductsBySupplierAndUser: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_SELLS_URL}/get-by-user-and-supplier/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierSellProducts],
    }),

    getSingleSupplierSellProduct: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_SELLS_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierSellProducts],
    }),
  }),
})

export const {
  useGetSupplierSellProductsBySupplierAndUserQuery,
  useGetSingleSupplierSellProductQuery,
} = supplierSellProductApi
