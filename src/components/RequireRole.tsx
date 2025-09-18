'use client';

import { useAuth } from '@/providers/auth-provider';
import { hasRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    return <div>Carregando...</div>;
  }

  if (!hasRole(user, roles)) {
    return null;
  }

  return <>{children}</>;
}
