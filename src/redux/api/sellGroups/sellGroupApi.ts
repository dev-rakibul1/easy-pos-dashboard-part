import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const SELL_GROUP_URL = '/sell-group'

export const sellGroupApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllSellGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),

    // Get sell group by current date
    getSellGroupByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SELL_GROUP_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          sellGroups: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.sellGroup],
    }),

    getSingleSellGroup: build.query({
      query: (id: string) => ({
        url: `${SELL_GROUP_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.purchaseGroup],
    }),
  }),
})

export const {
  useGetAllSellGroupQuery,
  useGetSingleSellGroupQuery,
  useGetSellGroupByCurrentDateQuery,
} = sellGroupApi
