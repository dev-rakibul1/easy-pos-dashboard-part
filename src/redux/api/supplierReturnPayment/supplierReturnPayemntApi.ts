import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SUPPLIER_RETURN_PAYMENT_URL = '/supplier-return-payment'

export const supplierReturnPayments = baseApi.injectEndpoints({
  endpoints: build => ({
    getSupplierReturnPaymentBySupplierAndUser: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_RETURN_PAYMENT_URL}/get-return-payment-by-user-and-supplier/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierReturnPayment],
    }),
    getSingleSupplierReturnPayment: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_RETURN_PAYMENT_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.supplierReturnPayment],
    }),
  }),
})

export const {
  useGetSupplierReturnPaymentBySupplierAndUserQuery,
  useGetSingleSupplierReturnPaymentQuery,
} = supplierReturnPayments
