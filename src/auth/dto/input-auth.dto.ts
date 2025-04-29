/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';


export class CreateAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}



export class SignInDto {
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  @ApiProperty()
  refresh_token: string;
}

export class RequestOtpDto {
  @IsEmail() ResetPasswordDto
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail() ResetPasswordDto
  @ApiProperty()
  email: string;
}
