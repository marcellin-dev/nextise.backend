/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { HttpModule } from 'src/http/http.module';
import { SchedulerService } from './scheduler.service';


@Module({
  imports: [HttpModule, EventsModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {








}