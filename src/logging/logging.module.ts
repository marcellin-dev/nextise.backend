/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Global()
@Module({
  providers: [{
    provide: LoggingService,
    useFactory: () => {
      return new LoggingService('DefaultLogger');
    }
  }],
  exports: [LoggingService],
})
export class LoggingModule { }
