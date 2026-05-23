import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Dialog, Transition, Menu } from '@headlessui/react';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '@/store/features/authSlice';
import { selectUnreadCount, selectNotifications, markAllAsRead, markAsRead } from '@/store/features/notificationSlice';
import { useLogoutMutation } from '@/store/services/authApi';
import { toast } from 'react-hot-toast';
import useSocket from '@/hooks/useSocket';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
];

export default function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const unreadCount = useAppSelector(selectUnreadCount);
  const notifications = useAppSelector(selectNotifications);
  const [logoutApi] = useLogoutMutation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize socket connection
  useSocket();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      // Continue with logout even if API fails
    }
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img src="/images/crm.jpg" alt="CRM" className="h-10 w-auto" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-2">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={
                              router.pathname === item.href
                                ? 'sidebar-link-active'
                                : 'sidebar-link-inactive'
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img src="/images/crm.jpg" alt="CRM" className="h-10 w-auto" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={
                      router.pathname === item.href
                        ? 'sidebar-link-active'
                        : 'sidebar-link-inactive'
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-secondary-200">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-secondary-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-secondary-900">{title}</h1>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="relative p-2 text-secondary-500 hover:text-secondary-700 rounded-lg hover:bg-secondary-100">
                  <BellIcon className={`h-6 w-6 ${unreadCount > 0 ? 'animate-jiggle' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-secondary-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-secondary-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className={`${
                                  active ? 'bg-secondary-50' : ''
                                } ${
                                  !notification.read ? 'bg-primary-50' : ''
                                } w-full px-4 py-3 text-left border-b border-secondary-100 last:border-0`}
                              >
                                <p className="text-sm font-medium text-secondary-900">{notification.title}</p>
                                <p className="text-xs text-secondary-500 mt-0.5">{notification.message}</p>
                                <p className="text-xs text-secondary-400 mt-1">
                                  {mounted ? formatDate(notification.timestamp) : ''}
                                </p>
                              </button>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200" />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-sm font-medium">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-secondary-700">
                    {user?.firstName}
                  </span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-secondary-500">{user?.email}</p>
                      <span className={`mt-1 inline-flex badge ${user?.role === 'admin' ? 'badge-info' : 'badge-secondary'}`}>
                        {user?.role}
                      </span>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard/profile"
                          className={`${
                            active ? 'bg-secondary-50' : ''
                          } flex items-center gap-2 px-4 py-2 text-sm text-secondary-700`}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard/settings"
                          className={`${
                            active ? 'bg-secondary-50' : ''
                          } flex items-center gap-2 px-4 py-2 text-sm text-secondary-700`}
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-secondary-50' : ''
                          } flex items-center gap-2 px-4 py-2 text-sm text-red-600 w-full`}
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
