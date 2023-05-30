import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from '../enums/userRoles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (this.roles.includes(user.rol)) {
      return true;
    }
    return false;
  }
}

export const roleGuardFactory = (roles: Roles[]) => {
  return new RolesGuard(roles);
};
