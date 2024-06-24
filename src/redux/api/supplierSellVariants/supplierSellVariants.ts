import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SUPPLIER_SELL_VARIANTS_URL = '/supplier-sell-variants'

export const supplierSellVariantsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getSingleSupplierSellVariants: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_SELL_VARIANTS_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierSellVariants],
    }),
  }),
})

export const { useGetSingleSupplierSellVariantsQuery } = supplierSellVariantsApi
