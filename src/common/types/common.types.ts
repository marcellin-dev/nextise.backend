/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString, Min } from "class-validator";




export class QueryFilter {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  limit: number;



  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ default: new Date(), required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  start: Date;

  @ApiProperty({ default: new Date(), required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  end: Date;
}

export interface Message {
  id: string;
  content: any;
}

export interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
}

