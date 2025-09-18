'use client';

import { useAuth } from '@/providers/auth-provider';
import { hasRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RequireRoleProps {
  roles: string | string[];
  children: React.ReactNode;
}

export default function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasRole(user, roles)) {
      router.push('/access-denied');
    }
  }, [user, loading, roles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasRole(user, roles)) {
    return null;
  }

  return <>{children}</>;
}
