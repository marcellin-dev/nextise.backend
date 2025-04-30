/* eslint-disable prettier/prettier */
import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataHashProvider, generateOtp, SendEmail } from 'src/common';
import { ResolveError } from 'src/common/errors';
import { LoggingService } from 'src/logging/logging.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto, RequestOtpDto } from './dto/input-auth.dto';

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly dataHashProvider: DataHashProvider,
    private readonly _logger: LoggingService
  ) {
    this._logger.setContext({ service: AuthService.name });
  }


  async create(createAuthDto: CreateAuthDto) {

    const { password, email, } = createAuthDto;
    const hash = await this.dataHashProvider.hash(password);
    try {

      const user = await this.prisma.user.create({
        data: {
          email: email,
          password: hash,
        }
      });

      delete user.password;
      const payload = { userId: user.id };

      return {
        user: user,
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_ACCESS_SECRET,
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '30d',
          secret: process.env.JWT_REFRESH_SECRET,
        }),
      };

    } catch (error) {
      this._logger.error('err ==> ', error);
      if (error.code === 'P2002') {
        throw new ConflictException(ResolveError('USER_EXIST'));
      } else throw error;
    }

  }


  async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user)
      throw new NotFoundException(ResolveError('USER_NOT_FOUND'));

    const isMatch = await this.dataHashProvider.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(ResolveError('BAD_CREDENTIALS'));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    const payload = { userId: user.id };
    // const payloadAccess = { userId: user.id, bizz: user.UserBusiness };

    const data = {
      user: result,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    return data;
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const otp = generateOtp();

    const oldOtp = await this.prisma.otp.findFirst({
      where: {
        email: requestOtpDto.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });


    this._logger.debug('oldOtp ==> ', oldOtp);

    if (oldOtp) {
      const createdAt = new Date(oldOtp.createdAt);
      const diff = new Date().getTime() - createdAt.getTime();

      if (diff < 1 * 60 * 1000) {
        throw new ForbiddenException(ResolveError('WAIT_ONE_MINUTE'));
      }
    }




    const message = `Votre code Otp est : ${otp}`;
    await this.prisma.otp.create({
      data: {
        otp: otp.toString(),

        email: requestOtpDto.email,

      }
    });
    SendEmail(requestOtpDto.email, message, "Nextise Otp");

    return { message: "Code Otp envoyé avec succès" };
  }


  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(ResolveError('USER_NOT_FOUND'));
    }

    const payload = { userId: user.id };

    const data = {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    return data;
  }

}
