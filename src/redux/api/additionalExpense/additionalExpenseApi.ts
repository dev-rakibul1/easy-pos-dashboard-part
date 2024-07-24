import { tagTypes } from '@/redux/tags/tagTypes'
import { IAdditionalExpense, IMeta } from '@/types'
import { baseApi } from '../baseApi'

const ADDITIONAL_EXPENSE_URL = '/additional-expense'

export const additionalExpenseApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new additional expense
    addANewAdditionalExpense: build.mutation({
      query: data => ({
        url: `${ADDITIONAL_EXPENSE_URL}/create-expense/`,
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.additionalExpense],
    }),

    // Get all additional expense by current date
    getAllAdditionalExpenseByCurrentDate: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/get-by-current-date`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IAdditionalExpense, meta: IMeta) => {
        return {
          expenses: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.additionalExpense],
    }),
    // Get all additional expense by current week
    getAllAdditionalExpenseByCurrentWeek: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/get-by-current-week`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IAdditionalExpense, meta: IMeta) => {
        return {
          expenses: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.additionalExpense],
    }),
    // Get all additional expense by current month
    getAllAdditionalExpenseByCurrentMonth: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/get-by-current-month`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IAdditionalExpense, meta: IMeta) => {
        return {
          expenses: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.additionalExpense],
    }),
    // Get all additional expense by current year
    getAllAdditionalExpenseByCurrentYear: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/get-by-current-year`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IAdditionalExpense, meta: IMeta) => {
        return {
          expenses: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.additionalExpense],
    }),
    // Get all additional expense
    getAllAdditionalExpense: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IAdditionalExpense, meta: IMeta) => {
        return {
          expenses: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.additionalExpense],
    }),

    // Delete additional expense
    deleteAdditionalExpense: build.mutation({
      query: (id: string) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.additionalExpense],
    }),

    // Update api
    updateAdditionalExpense: build.mutation({
      query: data => ({
        url: `${ADDITIONAL_EXPENSE_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.additionalExpense],
    }),

    // get single additional expense api
    getSingleAdditionalExpense: build.query({
      query: (id: string) => ({
        url: `${ADDITIONAL_EXPENSE_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.additionalExpense],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewAdditionalExpenseMutation,
  useGetAllAdditionalExpenseByCurrentDateQuery,
  useGetAllAdditionalExpenseByCurrentWeekQuery,
  useGetAllAdditionalExpenseByCurrentMonthQuery,
  useGetAllAdditionalExpenseByCurrentYearQuery,
  useGetSingleAdditionalExpenseQuery,
  useDeleteAdditionalExpenseMutation,
  useUpdateAdditionalExpenseMutation,
  useGetAllAdditionalExpenseQuery,
} = additionalExpenseApi
