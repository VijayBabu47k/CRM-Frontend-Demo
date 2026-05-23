import { apiSlice } from './api';

export interface Activity {
  id: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  } | null;
}

export interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ActivityStats {
  type: string;
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivities: builder.query<ActivitiesResponse, number | void>({
      query: (limit = 20) => `/activities/recent?limit=${limit}`,
      providesTags: ['Activities'],
    }),
    getAllActivities: builder.query<ActivitiesResponse, { page?: number; limit?: number; userId?: string; type?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.type) queryParams.append('type', params.type);
        return `/activities?${queryParams.toString()}`;
      },
      providesTags: ['Activities'],
    }),
    getActivityStats: builder.query<{ success: boolean; data: { stats: ActivityStats[] } }, void>({
      query: () => '/activities/stats',
      providesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetRecentActivitiesQuery,
  useGetAllActivitiesQuery,
  useGetActivityStatsQuery,
} = activityApi;
