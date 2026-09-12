export enum UserRole {
  CUSTOMER = 'customer',
  STORE_OWNER = 'store_owner',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  BANNED = 'Banned',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.STORE_OWNER]: 'Store Owner',
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.SUPER_ADMIN]: 'Super Administrator',
};

export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.CUSTOMER]: [UserRole.CUSTOMER],
  [UserRole.STORE_OWNER]: [UserRole.CUSTOMER, UserRole.STORE_OWNER],
  [UserRole.ADMIN]: [UserRole.CUSTOMER, UserRole.STORE_OWNER, UserRole.ADMIN],
  [UserRole.SUPER_ADMIN]: [
    UserRole.CUSTOMER,
    UserRole.STORE_OWNER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ],
};
