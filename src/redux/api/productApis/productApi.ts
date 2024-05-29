import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const PRODUCT_URL = '/product'

export const productApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewProduct: build.mutation({
      query: data => ({
        url: `${PRODUCT_URL}/create-product/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
  overrideExisting: false,
})

export const { useAddANewProductMutation } = productApi
