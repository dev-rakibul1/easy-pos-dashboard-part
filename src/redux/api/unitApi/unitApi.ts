import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const UNIT_URL = '/unit'

export const unitApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addANewUnit: build.mutation({
      query: data => ({
        url: `${UNIT_URL}/create-unit/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.unit],
    }),
  }),
  overrideExisting: false,
})

export const { useAddANewUnitMutation } = unitApi
