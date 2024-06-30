import { tagTypes } from '@/redux/tags/tagTypes'
import { baseApi } from '../baseApi'

const CUSTOMER_PAY_IN_USER_URL = '/customer-pay-in-user'

export const CustomerPayInUserApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Payment in the user
    createCustomerPayInUser: build.mutation({
      query: data => ({
        url: `${CUSTOMER_PAY_IN_USER_URL}/create-pay-in-user/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.customerPayInUser],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateCustomerPayInUserMutation } = CustomerPayInUserApi
