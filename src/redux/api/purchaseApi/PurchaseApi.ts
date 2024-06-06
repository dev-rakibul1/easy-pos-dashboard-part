import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const PURCHASE_URL = '/purchase'

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewPurchase: build.mutation({
      query: data => ({
        url: `${PURCHASE_URL}/create-purchase/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.purchase],
    }),

    getAllPurchase: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchases: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchase],
    }),

    getPurchaseBySupplierAndUser: build.query({
      query: (id: string) => ({
        url: `${PURCHASE_URL}/get-by-supplier-and-user/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchase],
    }),
  }),
})

export const {
  useGetPurchaseBySupplierAndUserQuery,
  useAddANewPurchaseMutation,
} = purchaseApi
