import Head from 'next/head';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAppSelector } from '@/hooks/useRedux';
import { selectCurrentUser } from '@/store/features/authSlice';

export default function SettingsPage() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <>
      <Head>
        <title>Settings | CRM Dashboard</title>
      </Head>

      <DashboardLayout title="Settings">
        <div className="max-w-3xl mx-auto">
          {/* Account Settings */}
          <div className="card mb-6">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Account Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <div>
                  <p className="font-medium text-secondary-900">Email Address</p>
                  <p className="text-sm text-secondary-500">{user?.email}</p>
                </div>
                <span className="badge badge-success">Verified</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <div>
                  <p className="font-medium text-secondary-900">Account Type</p>
                  <p className="text-sm text-secondary-500 capitalize">{user?.role} Account</p>
                </div>
                <span className={`badge ${user?.role === 'admin' ? 'badge-info' : 'badge-secondary'}`}>
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-secondary-900">Account Status</p>
                  <p className="text-sm text-secondary-500">Your account is currently active</p>
                </div>
                <span className="badge badge-success">{user?.status}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700">Irreversible actions</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Delete Account</p>
                  <p className="text-sm text-secondary-500">Permanently delete your account and all data</p>
                </div>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
