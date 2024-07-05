import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const ADDITIONAL_MONEY_BACK_URL = '/additional-money-back-to-user'

export const additionalMoneyBackApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Payment in the supplier
    createAdditionalMoneyBackToUser: build.mutation({
      query: data => ({
        url: `${ADDITIONAL_MONEY_BACK_URL}/create-pay/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.additionalMoneyBack],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateAdditionalMoneyBackToUserMutation } =
  additionalMoneyBackApi
