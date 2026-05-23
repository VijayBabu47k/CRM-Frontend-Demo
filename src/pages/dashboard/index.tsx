import { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  UsersIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiUserX,
  FiEdit,
  FiLock,
  FiActivity,
} from 'react-icons/fi';
import { useGetDashboardOverviewQuery } from '@/store/services/dashboardApi';

// Dynamically import charts to avoid SSR issues
const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false });
const UserChart = dynamic(() => import('@/components/charts/UserChart'), { ssr: false });
const ActivityChart = dynamic(() => import('@/components/charts/ActivityChart'), { ssr: false });

// Helper to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboardOverviewQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!data?.data) return [];

    const { users, revenue } = data.data;

    return [
      {
        name: 'Total Users',
        value: users.total,
        icon: UsersIcon,
        change: `${users.newThisMonth} this month`,
        changeType: 'increase',
        color: 'bg-blue-500',
      },
      {
        name: 'Active Users',
        value: users.active,
        icon: UserPlusIcon,
        change: `${Math.round((users.active / users.total) * 100)}% of total`,
        changeType: 'neutral',
        color: 'bg-green-500',
      },
      {
        name: 'Total Revenue',
        value: `$${revenue.total.toLocaleString()}`,
        icon: CurrencyDollarIcon,
        change: `$${revenue.thisMonth.toLocaleString()} this month`,
        changeType: 'increase',
        color: 'bg-purple-500',
      },
      {
        name: 'Avg Transaction',
        value: `$${revenue.average.toFixed(2)}`,
        icon: ArrowTrendingUpIcon,
        change: `${revenue.transactionCount} transactions`,
        changeType: 'neutral',
        color: 'bg-orange-500',
      },
    ];
  }, [data]);

  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActivityIcon = (type: string) => {
    const iconProps = { className: 'h-5 w-5' };
    const icons: Record<string, JSX.Element> = {
      login: <FiLogIn {...iconProps} className="h-5 w-5 text-green-500" />,
      logout: <FiLogOut {...iconProps} className="h-5 w-5 text-orange-500" />,
      user_created: <FiUserPlus {...iconProps} className="h-5 w-5 text-blue-500" />,
      user_deleted: <FiUserX {...iconProps} className="h-5 w-5 text-red-500" />,
      profile_update: <FiEdit {...iconProps} className="h-5 w-5 text-purple-500" />,
      password_change: <FiLock {...iconProps} className="h-5 w-5 text-yellow-600" />,
    };
    return icons[type] || <FiActivity className="h-5 w-5 text-secondary-500" />;
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | CRM Dashboard</title>
      </Head>

      <DashboardLayout title="Dashboard">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-secondary-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Overview</h3>
            <RevenueChart />
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Growth</h3>
            <UserChart />
          </div>
        </div>

        {/* Activity Chart & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Activity Trends</h3>
            <ActivityChart />
          </div>

          <div className="card">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activities</h3>
            </div>
            <div className="divide-y divide-secondary-100 max-h-96 overflow-y-auto">
              {data?.data.recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-secondary-50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary-100">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900">
                        {formatActivityType(activity.type)}
                      </p>
                      <p className="text-sm text-secondary-500 truncate">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <p className="text-xs text-secondary-400 mt-1">
                          by {activity.user.firstName} {activity.user.lastName}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-secondary-400 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        {mounted ? formatDate(activity.createdAt) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
