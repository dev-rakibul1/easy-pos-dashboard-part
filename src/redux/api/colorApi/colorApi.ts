import { tagTypes } from '@/redux/tags/tagTypes'
import { IColor, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const COLOR_URL = '/color'

export const colorApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewColor: build.mutation({
      query: data => ({
        url: `${COLOR_URL}/create-color/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.color],
    }),

    getAllColor: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${COLOR_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IColor, meta: IMeta) => {
        return {
          colors: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.color],
    }),

    getSingleColor: build.query({
      query: (id: string) => ({
        url: `${COLOR_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.color],
    }),

    updateColor: build.mutation({
      query: data => ({
        url: `${COLOR_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.color],
    }),

    deleteColor: build.mutation({
      query: (id: string) => ({
        url: `${COLOR_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.color],
    }),
  }),
})

export const { useAddANewColorMutation, useGetAllColorQuery } = colorApi
