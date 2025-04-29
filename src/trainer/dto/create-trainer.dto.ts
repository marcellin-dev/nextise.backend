/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateTrainerDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  training_subjects: string[];

  @IsString()
  @ApiProperty()
  location: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
