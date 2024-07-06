import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IPurchase } from '@/types'
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
      transformResponse: (response: IPurchase, meta: IMeta) => {
        return {
          purchases: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchase],
    }),

    // Get by current date
    getAllPurchaseByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IPurchase, meta: IMeta) => {
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

    // get single purchase api
    getSinglePurchase: build.query({
      query: (id: string) => ({
        url: `${PURCHASE_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.purchase],
    }),

    updatePurchase: build.mutation({
      query: data => ({
        url: `${PURCHASE_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.purchase],
    }),

    // Get purchase group by current date
    getPurchaseGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),
  }),
})

export const {
  useGetPurchaseBySupplierAndUserQuery,
  useAddANewPurchaseMutation,
  useGetAllPurchaseQuery,
  useGetSinglePurchaseQuery,
  useUpdatePurchaseMutation,
  useGetAllPurchaseByCurrentDateQuery,
  useGetPurchaseGroupByCurrentDateQuery,
} = purchaseApi
