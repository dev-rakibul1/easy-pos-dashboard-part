import { tagTypes } from '@/redux/tags/tagTypes'
import { IMeta, IProduct } from '@/types'
import { baseApi } from '../baseApi'

const PRODUCT_URL = '/product'

// video no 52.12

export const productApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Create a new product
    addANewProduct: build.mutation({
      query: data => ({
        url: `${PRODUCT_URL}/create-product/`,
        method: 'POST',
        data: data,
        contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // Get all product
    getAllProduct: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PRODUCT_URL}/`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IProduct, meta: IMeta) => {
        return {
          products: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.product],
    }),
    // Get all stock in product
    getAllStockInProduct: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PRODUCT_URL}/stock-in`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IProduct, meta: IMeta) => {
        return {
          products: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.product],
    }),

    // Delete product
    deleteProduct: build.mutation({
      query: (id: string) => ({
        url: `${PRODUCT_URL}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // Update api product
    updateProduct: build.mutation({
      query: data => ({
        url: `${PRODUCT_URL}/${data?.id}/`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // get single product api
    getSingleProduct: build.query({
      query: (id: string) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.product],
    }),

    // stock in get by status
    getStockInProductDependStatus: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PRODUCT_URL}/stock-in-product`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IProduct, meta: IMeta) => {
        return {
          products: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.product],
    }),

    // stock out get by status
    getStockOutProductDependStatus: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${PRODUCT_URL}/stock-out-product`,
        method: 'GET',
        params: arg,
      }),

      transformResponse: (response: IProduct, meta: IMeta) => {
        return {
          products: response,
          meta: meta,
        }
      },
      providesTags: [tagTypes.product],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddANewProductMutation,
  useGetAllProductQuery,
  useDeleteProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useGetAllStockInProductQuery,
  useGetStockInProductDependStatusQuery,
  useGetStockOutProductDependStatusQuery,
} = productApi
