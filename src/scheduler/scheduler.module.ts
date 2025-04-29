/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EventsModule } from 'src/events/events.module';
import { HttpModule } from 'src/http/http.module';
import { transactionProviders } from 'src/transaction/transaction.providers';
import { SchedulerService } from './scheduler.service';


@Module({
  imports: [HttpModule, DatabaseModule, EventsModule],
  providers: [SchedulerService, ...transactionProviders],
  exports: [...transactionProviders],
})
export class SchedulerModule {








}