import { Roles } from '../enums/userRoles.enum';

export interface UserRequest {
  sub: string;
  username: string;
  rol: 'normal' | 'manager' | 'super_user';
  isVerified: boolean;
}
