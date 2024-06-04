import { tagTypes } from '@/redux/tags/tagTypes'
import { ICategoryResponse, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const CATEGORY_URL = '/category'

export const categoryApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewCategory: build.mutation({
      query: data => ({
        url: `${CATEGORY_URL}/create-category/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    // Get all brand
    getAllCategory: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${CATEGORY_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: ICategoryResponse, meta: IMeta) => {
        return {
          categories: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.category],
    }),

    // Delete api category
    deleteCategory: build.mutation({
      query: (id: string) => ({
        url: `${CATEGORY_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.category],
    }),

    // category Update api
    updateCategory: build.mutation({
      query: data => ({
        url: `${CATEGORY_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    // get single category api
    getSingleCategory: build.query({
      query: (id: string) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.category],
    }),
  }),
})

export const {
  useAddANewCategoryMutation,
  useGetAllCategoryQuery,
  useGetSingleCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi
