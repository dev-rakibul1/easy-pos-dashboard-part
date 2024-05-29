import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const BRAND_URL = '/brand'

export const brandApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewBrand: build.mutation({
      query: data => ({
        url: `${BRAND_URL}/create-brand/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.brand],
    }),
  }),
  overrideExisting: false,
})

export const { useAddANewBrandMutation } = brandApi
