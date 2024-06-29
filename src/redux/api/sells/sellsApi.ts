import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const SELLS_URL = '/sell'

// video no 52.12

export const sellsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new sell
    addANewSells: build.mutation({
      query: data => ({
        url: `${SELLS_URL}/create-sell/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.sell],
    }),
  }),
  overrideExisting: false,
})

export const { useAddANewSellsMutation } = sellsApi
