import Head from 'next/head';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useGetUserAnalyticsQuery, useGetRevenueAnalyticsQuery } from '@/store/services/dashboardApi';

const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false });
const UserChart = dynamic(() => import('@/components/charts/UserChart'), { ssr: false });

export default function AnalyticsPage() {
  const { data: userAnalytics, isLoading: userLoading } = useGetUserAnalyticsQuery();
  const { data: revenueAnalytics, isLoading: revenueLoading } = useGetRevenueAnalyticsQuery();

  const isLoading = userLoading || revenueLoading;

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Analytics | CRM Dashboard</title>
      </Head>

      <DashboardLayout title="Analytics">
        {/* User Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-6">
              <p className="text-sm text-secondary-500">Total Users</p>
              <p className="text-3xl font-bold text-secondary-900">
                {userAnalytics?.data.totalUsers}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">Active Users</p>
              <p className="text-3xl font-bold text-green-600">
                {userAnalytics?.data.activeUsers}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">New This Week</p>
              <p className="text-3xl font-bold text-blue-600">
                {userAnalytics?.data.newUsersThisWeek}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">New This Month</p>
              <p className="text-3xl font-bold text-purple-600">
                {userAnalytics?.data.newUsersThisMonth}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Growth Trend</h3>
              <UserChart />
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">Active</span>
                    <span className="text-secondary-900 font-medium">
                      {userAnalytics?.data.activeUsers} ({Math.round((userAnalytics?.data.activeUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(userAnalytics?.data.activeUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">Inactive</span>
                    <span className="text-secondary-900 font-medium">
                      {userAnalytics?.data.inactiveUsers} ({Math.round((userAnalytics?.data.inactiveUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary-200 rounded-full">
                    <div
                      className="h-2 bg-red-500 rounded-full"
                      style={{ width: `${(userAnalytics?.data.inactiveUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">Pending</span>
                    <span className="text-secondary-900 font-medium">
                      {userAnalytics?.data.pendingUsers} ({Math.round((userAnalytics?.data.pendingUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${(userAnalytics?.data.pendingUsers || 0) / (userAnalytics?.data.totalUsers || 1) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-6">
              <p className="text-sm text-secondary-500">Total Revenue</p>
              <p className="text-3xl font-bold text-secondary-900">
                ${revenueAnalytics?.data.summary.total.toLocaleString()}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">This Month</p>
              <p className="text-3xl font-bold text-green-600">
                ${revenueAnalytics?.data.summary.thisMonth.toLocaleString()}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">This Year</p>
              <p className="text-3xl font-bold text-blue-600">
                ${revenueAnalytics?.data.summary.thisYear.toLocaleString()}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-secondary-500">Avg Transaction</p>
              <p className="text-3xl font-bold text-purple-600">
                ${revenueAnalytics?.data.summary.average.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Trend</h3>
              <RevenueChart />
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue by Source</h3>
              <div className="space-y-3">
                {revenueAnalytics?.data.bySource.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{source.name}</p>
                      <p className="text-xs text-secondary-500">{source.count} transactions</p>
                    </div>
                    <p className="text-sm font-semibold text-secondary-900">
                      ${source.total.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card mt-6">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {revenueAnalytics?.data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary-50">
                      <td>
                        <span className="badge-info">{tx.source}</span>
                      </td>
                      <td className="font-semibold text-green-600">
                        ${tx.amount.toLocaleString()}
                      </td>
                      <td className="text-secondary-600">
                        {tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : 'N/A'}
                      </td>
                      <td className="text-secondary-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
