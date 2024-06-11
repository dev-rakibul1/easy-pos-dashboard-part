import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, ISupplier } from '@/types'
import { baseApi } from '../baseApi'

const SUPPLIER_URL = '/supplier'

// video no 52.12

export const supplierApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new supplier
    addANewSupplier: build.mutation({
      query: data => ({
        url: `${SUPPLIER_URL}/create-supplier/`,
        method: 'POST',
        data: data,
        contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.supplier],
    }),

    // Get all supplier
    getAllSupplier: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${SUPPLIER_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: ISupplier, meta: IMeta) => {
        return {
          suppliers: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.supplier],
    }),

    // Delete Supplier
    deleteSupplier: build.mutation({
      query: (id: string) => ({
        url: `${SUPPLIER_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.supplier],
    }),

    // Update api Supplier
    updateSupplier: build.mutation({
      query: data => ({
        url: `${SUPPLIER_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.supplier],
    }),

    // get single Supplier api
    getSingleSupplier: build.query({
      query: (id: string) => ({
        url: `${SUPPLIER_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.supplier],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewSupplierMutation,
  useGetAllSupplierQuery,
  useGetSingleSupplierQuery,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
} = supplierApi
