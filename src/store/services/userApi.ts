import { apiSlice } from './api';
import { User } from './authApi';

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    pendingUsers: number;
    adminCount: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
  department?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
  department?: string;
  avatarUrl?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.role) params.append('role', filters.role);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        return `/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUserById: builder.query<{ success: boolean; data: { user: User } }, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation<{ success: boolean; message: string; data: { user: User } }, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }, 'Dashboard'],
    }),
    updateUser: builder.mutation<{ success: boolean; message: string; data: { user: User } }, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }, { type: 'Users', id: 'LIST' }, 'Dashboard'],
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }, 'Dashboard'],
    }),
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => '/users/stats/overview',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
} = userApi;
