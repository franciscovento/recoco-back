import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Si no hay usuario (token inválido o no proporcionado), no lanzar error
    if (err || !user) {
      return null; // Retorna null en lugar de lanzar error
    }
    return user;
  }
}
