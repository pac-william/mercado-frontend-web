import { CurrentUser } from '@/types/auth';

export function hasRole(user: CurrentUser | null, roles: string | string[]): boolean {
  if (!user || !user.roles) return false;
  
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.some(role => user.roles?.includes(role));
}

export function isAdmin(user: CurrentUser | null): boolean {
  return hasRole(user, 'admin');
}
