import { apiSlice } from "./apiSlice";
import { setCredentials, clearCredentials } from "../slices/authSlice";
import toast from "react-hot-toast";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/user/signup",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Signup failed:", error);
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    getUserDetails: builder.query({
      query: () => "/user/user",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch (error) {
          console.error("Get user details failed:", error);
          dispatch(clearCredentials());
        }
      },
      providesTags: ["User"],
    }),
    verifyOtpAndSignup: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/user/verify-otp/signup",
        method: "POST",
        body: {
          email,
          otp,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
          toast.success(data.message || "OTP verified");
        } catch (error) {
          toast.error(error.message || "Something went wrong");
          console.error("OTP verification failed:", error);
        }
      },
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/send/otp",
        method: "POST",
        body: {
          email,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(data.message || "OTP sent");
        } catch (error) {
          toast.error(error.message || "Something went wrong");
          console.log("OTP failed:", error);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserDetailsQuery,
  useVerifyOtpAndSignupMutation,
  useSendOtpMutation,
} = authApi;
