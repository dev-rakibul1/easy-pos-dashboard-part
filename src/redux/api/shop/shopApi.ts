import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta } from '@/types'
import { baseApi } from '../baseApi'

const SHOP = '/shop'

export const ShopApi = baseApi.injectEndpoints({
  endpoints: build => ({
    recordAShopInfo: build.mutation({
      query: data => ({
        url: `${SHOP}/create-shop/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.shop],
    }),

    getAllShop: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SHOP}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => {
        return {
          shop: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.shop],
    }),

    getSingleShop: build.query({
      query: (id: string) => ({
        url: `${SHOP}/get-single-shop/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.shop],
    }),
    getFirstShop: build.query({
      query: () => ({
        url: `${SHOP}/get-first/`,
        method: 'GET',
      }),

      providesTags: [tagTypes.shop],
    }),

    updateShopRecord: build.mutation({
      query: data => ({
        url: `${SHOP}/update-shop/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.shop],
    }),

    deleteShopRecord: build.mutation({
      query: (id: string) => ({
        url: `${SHOP}/delete-shop/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.shop],
    }),
  }),
})

export const {
  useRecordAShopInfoMutation,
  useGetAllShopQuery,
  useGetSingleShopQuery,
  useUpdateShopRecordMutation,
  useDeleteShopRecordMutation,
  useGetFirstShopQuery,
} = ShopApi
