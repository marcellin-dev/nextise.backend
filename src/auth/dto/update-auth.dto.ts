import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './input-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) { }
