// Roles
export const USER_ROLE_USER = 'user';
export const USER_ROLE_MODERATOR = 'moderator';
export const USER_ROLE_ADMIN = 'admin';
export const USER_ROLE_OWNER = 'owner';

export type UserRoles =
  typeof USER_ROLE_USER |
  typeof USER_ROLE_MODERATOR |
  typeof USER_ROLE_ADMIN |
  typeof USER_ROLE_OWNER;

// Statuses
export const USER_STATUS_ACTIVE = 'active';
export const USER_STATUS_BLOCKED = 'blocked';
export const USER_STATUS_DELETED = 'deleted';

export type UserStatuses =
  typeof USER_STATUS_ACTIVE |
  typeof USER_STATUS_BLOCKED |
  typeof USER_STATUS_DELETED;

interface IUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRoles;
  status: UserStatuses;
}

export default IUser;