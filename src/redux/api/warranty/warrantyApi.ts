import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IWarranties } from '@/types'
import { baseApi } from '../baseApi'

const WARRANTY_URL = '/warranty'

export const warrantyApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewWarranty: build.mutation({
      query: data => ({
        url: `${WARRANTY_URL}/create-warranty/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.warranty],
    }),

    getAllPendingWarranty: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${WARRANTY_URL}/get-pending`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IWarranties, meta: IMeta) => {
        return {
          warranties: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.warranty],
    }),

    getSinglePending: build.query({
      query: (id: string) => ({
        url: `${WARRANTY_URL}/get-single-pending/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.warranty],
    }),

    getAllDeliveryWarranty: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${WARRANTY_URL}/get-delivery`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IWarranties, meta: IMeta) => {
        return {
          warranties: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.warranty],
    }),

    deliveryPendingWarranty: build.mutation({
      query: data => ({
        url: `${WARRANTY_URL}/delivered/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.warranty],
    }),
  }),
})

export const {
  useAddANewWarrantyMutation,
  useGetAllPendingWarrantyQuery,
  useGetAllDeliveryWarrantyQuery,
  useGetSinglePendingQuery,
  useDeliveryPendingWarrantyMutation,
} = warrantyApi
