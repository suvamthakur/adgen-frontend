import toast from "react-hot-toast";
import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all avatars
    getAvatars: builder.query({
      query: () => "/order/avatars",
      transformResponse: (response) => response.data,
      providesTags: ["Avatar"],
    }),

    // Get all voices
    getVoices: builder.query({
      query: () => "/order/voices",
      transformResponse: (response) => response.data,
      providesTags: ["Voice"],
    }),

    // Create a new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/create",
        method: "POST",
        body: orderData,
        formData: true, // Important for file uploads
      }),
      invalidatesTags: ["Order"],
    }),

    // Get products for an order
    getProducts: builder.query({
      query: (orderId) => `/order/products/${orderId}`,
      transformResponse: (response) => response.data,
      providesTags: ["Products"],
    }),

    // Edit a product
    editProduct: builder.mutation({
      query: (productData) => ({
        url: "/order/product/edit",
        method: "PATCH",
        body: productData,
      }),
      invalidatesTags: ["Products", "Order"],
    }),

    // Get all orders
    getAllOrders: builder.query({
      query: () => "/order/all",
      transformResponse: (response) => response.data,
      providesTags: ["Orders"],
    }),

    // Get a single order by ID
    getOrder: builder.query({
      query: (orderId) => `/order/single/${orderId}`,
      transformResponse: (response) => response.data,
      providesTags: ["Order"],
    }),

    // Generate the AD
    generateAd: builder.mutation({
      query: (orderId) => ({
        url: "/order/video/generate",
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["Order", "Orders"],

      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          toast.error(err.message || "Error generating AD");
        }
      },
    }),
  }),
});

export const {
  useGetAvatarsQuery,
  useGetVoicesQuery,
  useCreateOrderMutation,
  useGetProductsQuery,
  useEditProductMutation,
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useGenerateAdMutation,
} = orderApi;
