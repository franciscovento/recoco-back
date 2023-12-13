import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../enums/userRoles.enum';

@Injectable()
export class UserUpdateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub; // Assuming you have the user ID available in the request object
    const resourceId = request.params.id; // Assuming the resource ID is available in the request parameters
    if (request.user.rol === Roles.super_user) {
      return next.handle();
    }
    if (userId !== resourceId) {
      throw new ForbiddenException('Unauthorized');
    }
    return next.handle();
  }
}
