import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const PURCHASE_GROUP_URL = '/purchase-group'

export const purchaseGroupApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllPurchaseGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          purchaseGroup: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.purchaseGroup],
    }),

    getSinglePurchaseGroup: build.query({
      query: (id: string) => ({
        url: `${PURCHASE_GROUP_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchaseGroup],
    }),

    // Get purchase group by current date
    getPurchaseGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PURCHASE_GROUP_URL}/get-by-current-date`,
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
  useGetSinglePurchaseGroupQuery,
  useGetPurchaseGroupByCurrentDateQuery,
} = purchaseGroupApi
