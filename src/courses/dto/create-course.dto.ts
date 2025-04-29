/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsDate()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString()
  @ApiProperty()
  subject: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsNumber()
  @ApiProperty()
  participants: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  notes?: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  trainer_price: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  trainer_id?: string;
}
