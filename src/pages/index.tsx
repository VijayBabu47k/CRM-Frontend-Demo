import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/useRedux';
import { selectIsAuthenticated } from '@/store/features/authSlice';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}
