import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IVats } from '@/types'
import { baseApi } from '../baseApi'

const VAT_URL = '/vat'

export const vatApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewVats: build.mutation({
      query: data => ({
        url: `${VAT_URL}/create-vat/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.vats],
    }),

    getAllVats: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${VAT_URL}`,
        method: 'GET',
        params: arg,
      }),
      transformResponse: (response: IVats, meta: IMeta) => {
        return {
          vats: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.vats],
    }),

    getSingleVats: build.query({
      query: (id: string) => ({
        url: `${VAT_URL}/${id}`,
        method: 'GET',
      }),

      providesTags: [tagTypes.vats],
    }),

    updateVats: build.mutation({
      query: data => ({
        url: `${VAT_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.vats],
    }),

    deleteVats: build.mutation({
      query: (id: string) => ({
        url: `${VAT_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.vats],
    }),
  }),
})

export const {
  useAddANewVatsMutation,
  useGetAllVatsQuery,
  useGetSingleVatsQuery,
  useUpdateVatsMutation,
  useDeleteVatsMutation,
} = vatApi
