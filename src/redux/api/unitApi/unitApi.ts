import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IUnitDataResponse } from '@/types'
import { baseApi } from '../baseApi'

const UNIT_URL = '/unit'

export const unitApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewUnit: build.mutation({
      query: data => ({
        url: `${UNIT_URL}/create-unit/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.unit],
    }),

    getAllUnit: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${UNIT_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IUnitDataResponse, meta: IMeta) => {
        return {
          units: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.unit],
    }),

    getSingleUnit: build.query({
      query: (id: string) => ({
        url: `${UNIT_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.unit],
    }),

    updateUnit: build.mutation({
      query: data => ({
        url: `${UNIT_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.unit],
    }),

    deleteUnit: build.mutation({
      query: (id: string) => ({
        url: `${UNIT_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.unit],
    }),
  }),
})

export const {
  useAddANewUnitMutation,
  useGetAllUnitQuery,
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi
