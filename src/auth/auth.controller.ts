/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, RequestOtpDto, SignInDto } from './dto/input-auth.dto';
import { RefreshTokenAuthGuard } from './strategies/refresh-token-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }


  @Post('request-otp')
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto);
  }


  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }
}
