import { tagTypes } from '@/redux/tags/tagTypes'
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
  }),
  overrideExisting: false,
})

export const { useAddANewCategoryMutation } = categoryApi
