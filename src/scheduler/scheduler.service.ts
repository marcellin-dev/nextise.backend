/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Event } from 'src/common';
import { EventsGateway } from 'src/events/events.gateway';
import { HttpService } from 'src/http/http.service';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class SchedulerService {
  config = new ConfigService();
  isProcessing = false;
  constructor(

    private readonly _logger: LoggingService,
    private readonly httpService: HttpService,
    private eventGateway: EventsGateway,
  ) {
    this._logger.setContext({ service: SchedulerService.name });
    console.log('SchedulerModule initialized ........');
  }


  @Cron(CronExpression.EVERY_MINUTE)
  async handleCreateMockTransaction() {



  }

  sendToClient(event: Event, data: any) {
    this.eventGateway.emitToAllRegisteredUsers(event, data);
  }



}
