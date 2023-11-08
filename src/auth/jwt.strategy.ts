import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      username: payload.username,
      rol: payload.rol,
      isVerified: payload.isVerified,
    };
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      req.cookies.auth_token &&
      req.cookies.auth_token.length > 0
    ) {
      return req.cookies.auth_token;
    }
    return null;
  }
}
