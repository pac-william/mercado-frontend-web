import { CurrentUser } from '@/types/auth';

export function hasRole(user: CurrentUser | null, roles: string | string[]): boolean {
  if (!user || !user.role) return false;
  
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  // Mapear roles antigas para novas
  const roleMapping: Record<string, string[]> = {
    'admin': ['MARKET_ADMIN', 'admin'],
    'user': ['CUSTOMER', 'user'],
    'MARKET_ADMIN': ['MARKET_ADMIN', 'admin'],
    'CUSTOMER': ['CUSTOMER', 'user']
  };
  
  return requiredRoles.some(role => {
    const mappedRoles = roleMapping[role] || [role];
    return mappedRoles.includes(user.role);
  });
}

export function isAdmin(user: CurrentUser | null): boolean {
  return hasRole(user, ['MARKET_ADMIN', 'admin']);
}
