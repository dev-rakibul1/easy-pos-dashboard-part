import { tagTypes } from '@/redux/tags/tagTypes'
import { ICustomer, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const CUSTOMER_URL = '/customer'

// video no 52.12

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new customer
    addANewCustomer: build.mutation({
      query: data => ({
        url: `${CUSTOMER_URL}/create-customer`,
        method: 'POST',
        data: data,
        contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.customer],
    }),

    // Get all customer
    getAllCustomer: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${CUSTOMER_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: ICustomer, meta: IMeta) => {
        return {
          customers: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.customer],
    }),

    // Delete customer
    deleteCustomer: build.mutation({
      query: (id: string) => ({
        url: `${CUSTOMER_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.customer],
    }),

    // Update api customer
    updateCustomer: build.mutation({
      query: data => ({
        url: `${CUSTOMER_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.customer],
    }),

    // get single customer api
    getSingleCustomer: build.query({
      query: (id: string) => ({
        url: `${CUSTOMER_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.customer],
    }),
    // get customer api by user id
    getCustomerByUserId: build.query({
      query: (id: string) => ({
        url: `${CUSTOMER_URL}/get-by-user-id/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.customer],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewCustomerMutation,
  useGetAllCustomerQuery,
  useGetSingleCustomerQuery,
  useGetCustomerByUserIdQuery,
} = customerApi
