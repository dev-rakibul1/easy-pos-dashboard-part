import { tagTypes } from '@/redux/tags/tagTypes'
import { IBrandResponse, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const BRAND_URL = '/brand'

export const brandApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new brand
    addANewBrand: build.mutation({
      query: data => ({
        url: `${BRAND_URL}/create-brand/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // Get all brand
    getAllBrand: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${BRAND_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IBrandResponse, meta: IMeta) => {
        return {
          brands: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.brand],
    }),

    // Delete api
    deleteBrand: build.mutation({
      query: (id: string) => ({
        url: `${BRAND_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // Update api
    updateBrand: build.mutation({
      query: data => ({
        url: `${BRAND_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // get single brand api
    getSingleBrand: build.query({
      query: (id: string) => ({
        url: `${BRAND_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.brand],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewBrandMutation,
  useGetAllBrandQuery,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
  useGetSingleBrandQuery,
} = brandApi
