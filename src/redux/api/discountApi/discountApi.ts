import { tagTypes } from '@/redux/tags/tagTypes'
import { IDiscounts, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const DISCOUNT_URL = '/discount'

export const discountApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewDiscount: build.mutation({
      query: data => ({
        url: `${DISCOUNT_URL}/create-discount/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.discounts],
    }),

    getAllDiscount: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${DISCOUNT_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IDiscounts, meta: IMeta) => {
        return {
          discounts: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.discounts],
    }),

    getSingleDiscount: build.query({
      query: (id: string) => ({
        url: `${DISCOUNT_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.discounts],
    }),

    updateDiscount: build.mutation({
      query: data => ({
        url: `${DISCOUNT_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.discounts],
    }),

    deleteDiscount: build.mutation({
      query: (id: string) => ({
        url: `${DISCOUNT_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.discounts],
    }),
  }),
})

export const { useAddANewDiscountMutation, useGetAllDiscountQuery } =
  discountApi
