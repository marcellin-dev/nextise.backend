/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { DataHashProvider } from './data-hash.provider';
import { Argon2DataHashProvider } from './implementations/argon2-data-hash.provider';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenAuthGuard } from 'src/auth/strategies/access-token-auth.guard';

@Global()
@Module({
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenAuthGuard },
    { provide: DataHashProvider, useClass: Argon2DataHashProvider },
  ],
  exports: [DataHashProvider],
})
export class CommonModule { }
