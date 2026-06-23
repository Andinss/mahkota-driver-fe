export function canAccess(
  userPermissions: string[] | undefined | null,
  requiredPermission: string,
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
}

export function canAccessAny(
  userPermissions: string[] | undefined | null,
  requiredPermissions: string[],
): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.some((p) => userPermissions.includes(p));
}
