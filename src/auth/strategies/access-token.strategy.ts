/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { ICurrentUser } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any): Promise<ICurrentUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        completionStep: true,
        kycVerified: true,
        Profile: true

      }
    });
    return user;

  }
}
