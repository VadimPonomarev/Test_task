import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  User,
  UsersResponse,
  LoginCredentials,
  AuthResponse,
  Cart,
  Post,
  Todo,
} from "../types/user";

const BASE_URL = "https://dummyjson.com";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
          localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      },
    }),

    getUsers: builder.query<
      UsersResponse,
      {
        limit?: number;
        skip?: number;
        select?: string;
        sortBy?: string;
        order?: "asc" | "desc";
      }
    >({
      query: ({ limit = 30, skip = 0, select, sortBy, order }) => {
        let url = `/users?limit=${limit}&skip=${skip}`;
        if (select) url += `&select=${select}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (order) url += `&order=${order}`;
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: "Users", id }],
    }),

    searchUsers: builder.query<UsersResponse, string>({
      query: (query) => `/users/search?q=${query}`,
    }),

    filterUsers: builder.query<UsersResponse, { key: string; value: string }>({
      query: ({ key, value }) => `/users/filter?key=${key}&value=${value}`,
    }),

    addUser: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/users/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Users", id }],
    }),

    deleteUser: builder.mutation<
      { id: number; isDeleted: boolean; deletedOn: string },
      number
    >({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getUserCarts: builder.query<
      { carts: Cart[]; total: number; skip: number; limit: number },
      number
    >({
      query: (userId) => `/users/${userId}/carts`,
    }),

    getUserPosts: builder.query<
      { posts: Post[]; total: number; skip: number; limit: number },
      number
    >({
      query: (userId) => `/users/${userId}/posts`,
    }),

    getUserTodos: builder.query<
      { todos: Todo[]; total: number; skip: number; limit: number },
      number
    >({
      query: (userId) => `/users/${userId}/todos`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useSearchUsersQuery,
  useFilterUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserCartsQuery,
  useGetUserPostsQuery,
  useGetUserTodosQuery,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = api;
