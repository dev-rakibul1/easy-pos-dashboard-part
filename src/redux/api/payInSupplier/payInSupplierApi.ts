import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const PAY_IN_SUPPLIER_URL = '/pay-in-supplier'

export const payInSupplierApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Payment in the supplier
    createPayInSupplier: build.mutation({
      query: data => ({
        url: `${PAY_IN_SUPPLIER_URL}/create-pay/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.payInSupplier],
    }),
  }),
  overrideExisting: false,
})

export const { useCreatePayInSupplierMutation } = payInSupplierApi
