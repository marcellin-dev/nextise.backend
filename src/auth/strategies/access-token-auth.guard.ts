/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log('isPublic ===> ', isPublic);
    if (isPublic) return true;

    return super.canActivate(context);
  }
}
