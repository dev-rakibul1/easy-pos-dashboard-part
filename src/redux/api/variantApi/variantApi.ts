import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IVariant } from '@/types'
import { baseApi } from '../baseApi'

const VARIANT = '/variant'

export const variantApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getAllVariants: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${VARIANT}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IVariant, meta: IMeta) => {
        return {
          variants: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.variants],
    }),

    getSingleVariant: build.query({
      query: (id: string) => ({
        url: `${VARIANT}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.variants],
    }),

    deleteVariant: build.mutation({
      query: (id: string) => ({
        url: `${VARIANT}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.variants],
    }),
  }),
})

export const {
  useGetAllVariantsQuery,
  useGetSingleVariantQuery,
  useDeleteVariantMutation,
} = variantApi
