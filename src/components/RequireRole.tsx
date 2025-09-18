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
    // Se não está carregando e não tem usuário, redirecionar para login
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Se tem usuário mas não tem role, redirecionar para acesso negado
    if (!loading && user && !hasRole(user, roles)) {
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

  // Se não tem usuário, não renderizar nada
  if (!user) {
    return null;
  }

  // Se não tem role, não renderizar nada
  if (!hasRole(user, roles)) {
    return null;
  }

  return <>{children}</>;
}
