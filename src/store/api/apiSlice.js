import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Order",
    "Orders",
    "Product",
    "Products",
    "Avatar",
    "Voice",
  ],
  endpoints: (builder) => ({}),
});
