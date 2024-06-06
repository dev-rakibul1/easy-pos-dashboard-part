import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SUPPLIER_PAYMENT_URL = '/supplier-payment'

export const supplierPaymentApi = baseApi.injectEndpoints({
  endpoints: build => ({
    supplierPaymentBySupplierUser: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_PAYMENT_URL}/supplier-and-user-trans/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierPayments],
    }),
  }),
})

export const { useSupplierPaymentBySupplierUserQuery } = supplierPaymentApi
