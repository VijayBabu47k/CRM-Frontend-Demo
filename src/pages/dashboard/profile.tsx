import { useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectCurrentUser, updateUser } from '@/store/features/authSlice';
import { useUpdateMeMutation, useChangePasswordMutation } from '@/store/services/authApi';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    try {
      const result = await updateMe(profileData).unwrap();
      dispatch(updateUser(result.data.user));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Head>
        <title>Profile | CRM Dashboard</title>
      </Head>

      <DashboardLayout title="Profile">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-700">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-secondary-600">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${user?.role === 'admin' ? 'badge-info' : 'badge-secondary'}`}>
                    {user?.role}
                  </span>
                  <span className="badge badge-success">{user?.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="card mb-6">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Profile Information</h3>
              <p className="text-sm text-secondary-500">Update your personal information</p>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className={profileErrors.firstName ? 'input-error' : 'input'}
                  />
                  {profileErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className={profileErrors.lastName ? 'input-error' : 'input'}
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="label">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="label">Department</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={profileData.department}
                    onChange={handleProfileChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isUpdating} className="btn-primary">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Change Password</h3>
              <p className="text-sm text-secondary-500">Update your password</p>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label htmlFor="currentPassword" className="label">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.currentPassword ? 'input-error' : 'input'}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPassword" className="label">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'input-error' : 'input'}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'input-error' : 'input'}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isChangingPassword} className="btn-primary">
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
