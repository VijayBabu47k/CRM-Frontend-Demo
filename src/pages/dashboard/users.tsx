import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UserModal from '@/components/modals/UserModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import Pagination from '@/components/ui/Pagination';
import { useAppSelector } from '@/hooks/useRedux';
import { selectIsAdmin } from '@/store/features/authSlice';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/store/services/userApi';
import { User } from '@/store/services/authApi';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

type SortField = 'created_at' | 'first_name' | 'last_name' | 'email' | 'status' | 'role';
type SortOrder = 'ASC' | 'DESC';

export default function UsersPage() {
  const isAdmin = useAppSelector(selectIsAdmin);

  // Filters state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');

  // Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // API hooks
  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page,
    limit,
    search,
    status: statusFilter,
    role: roleFilter,
    sortBy,
    sortOrder,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Debounced search
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  // Handle create/edit user
  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser.id, data: userData }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUser(userData).unwrap();
        toast.success('User created successfully');
      }
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete user');
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'badge-success',
      inactive: 'badge-danger',
      pending: 'badge-warning',
    };
    return badges[status] || 'badge-secondary';
  };

  // Get role badge color
  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 'badge-info' : 'badge-secondary';
  };

  return (
    <>
      <Head>
        <title>Users | CRM Dashboard</title>
      </Head>

      <DashboardLayout title="User Management">
        <div className="card">
          {/* Header */}
          <div className="px-6 py-4 border-b border-secondary-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-secondary-900">Users</h2>
              {isAdmin && (
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setIsUserModalOpen(true);
                  }}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add User
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-secondary-50 border-b border-secondary-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or department..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </form>

              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="input w-auto"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="input w-auto"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>

                {(search || statusFilter || roleFilter) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setSearchInput('');
                      setStatusFilter('');
                      setRoleFilter('');
                      setPage(1);
                    }}
                    className="btn-ghost text-secondary-600"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading users</p>
                <button onClick={() => refetch()} className="btn-primary mt-4">
                  Retry
                </button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th
                      className="cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('first_name')}
                    >
                      <span className="flex items-center gap-2">
                        Name
                        {sortBy === 'first_name' && (
                          <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('email')}
                    >
                      <span className="flex items-center gap-2">
                        Email
                        {sortBy === 'email' && (
                          <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th>Department</th>
                    <th
                      className="cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('role')}
                    >
                      <span className="flex items-center gap-2">
                        Role
                        {sortBy === 'role' && (
                          <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('status')}
                    >
                      <span className="flex items-center gap-2">
                        Status
                        {sortBy === 'status' && (
                          <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('created_at')}
                    >
                      <span className="flex items-center gap-2">
                        Joined
                        {sortBy === 'created_at' && (
                          <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    {isAdmin && <th className="text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {data?.data.users.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-medium">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.phone && (
                              <p className="text-xs text-secondary-500">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary-600">{user.email}</td>
                      <td className="text-secondary-600">{user.department || '-'}</td>
                      <td>
                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                      </td>
                      <td>
                        <span className={getStatusBadge(user.status)}>{user.status}</span>
                      </td>
                      <td className="text-secondary-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {data?.data.pagination && (
            <div className="px-6 py-4 border-t border-secondary-200">
              <Pagination
                currentPage={data.data.pagination.page}
                totalPages={data.data.pagination.totalPages}
                total={data.data.pagination.total}
                limit={data.data.pagination.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        {/* User Modal */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
          user={selectedUser}
          isLoading={isCreating || isUpdating}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteUser}
          isLoading={isDeleting}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        />
      </DashboardLayout>
    </>
  );
}
