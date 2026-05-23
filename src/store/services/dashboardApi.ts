import { apiSlice } from './api';

export interface DashboardOverview {
  users: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    average: number;
    transactionCount: number;
  };
  activities: Array<{
    type: string;
    count: number;
    today: number;
    this_week: number;
    this_month: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string;
    } | null;
  }>;
}

export interface ChartData {
  label: string;
  value: number;
  transactions?: number;
}

export interface RevenueAnalytics {
  summary: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    average: number;
    transactionCount: number;
  };
  bySource: Array<{
    name: string;
    total: number;
    count: number;
    average: number;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    source: string;
    description: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  adminCount: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  distribution: {
    byStatus: Array<{ name: string; value: number }>;
    byRole: Array<{ name: string; value: number }>;
  };
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<{ success: boolean; data: DashboardOverview }, void>({
      query: () => '/dashboard/overview',
      providesTags: ['Dashboard'],
    }),
    getUserAnalytics: builder.query<{ success: boolean; data: UserAnalytics }, void>({
      query: () => '/dashboard/users/analytics',
      providesTags: ['Dashboard'],
    }),
    getRevenueAnalytics: builder.query<{ success: boolean; data: RevenueAnalytics }, void>({
      query: () => '/dashboard/revenue/analytics',
      providesTags: ['Dashboard'],
    }),
    getRevenueChartData: builder.query<{ success: boolean; data: { period: string; chartData: ChartData[] } }, string>({
      query: (period = 'monthly') => `/dashboard/charts/revenue?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getUserChartData: builder.query<{ success: boolean; data: { chartData: ChartData[] } }, void>({
      query: () => '/dashboard/charts/users',
      providesTags: ['Dashboard'],
    }),
    getActivityChartData: builder.query<{ success: boolean; data: { chartData: ChartData[] } }, void>({
      query: () => '/dashboard/charts/activities',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetUserAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetRevenueChartDataQuery,
  useGetUserChartDataQuery,
  useGetActivityChartDataQuery,
} = dashboardApi;
