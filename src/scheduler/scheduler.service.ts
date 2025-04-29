/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { delay, from, mergeMap, tap } from 'rxjs';
import { Event } from 'src/common';
import { EventsGateway } from 'src/events/events.gateway';
import { HttpService } from 'src/http/http.service';
import { LoggingService } from 'src/logging/logging.service';
import { Transactions } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class SchedulerService {
  config = new ConfigService();
  isProcessing = false;
  constructor(
    @Inject('TRANSACTION_REPOSITORY') private transactionRepository: typeof Transactions,
    private readonly _logger: LoggingService,
    private readonly httpService: HttpService,
    private eventGateway: EventsGateway,
  ) {
    this._logger.setContext({ service: SchedulerService.name });
    console.log('SchedulerModule initialized ........');
  }


  @Cron(CronExpression.EVERY_MINUTE)
  async handleCreateMockTransaction() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this._logger.debug('Starting simulated transaction creation...');

    const data = {
      "value": Math.floor(Math.random() * 10000) + 1,
      "receiver": `user_${Math.floor(Math.random() * 100)}@example.com`,
      "sender": `user_${Math.floor(Math.random() * 100)}@example.com`
    }
    this._logger.debug('Mock transaction data:', { data });
    from(this.httpService.POST(this.config.get('APP_BASE_URL') + '/transaction', data))
      .pipe(
        tap(response => this._logger.debug('Transaction created:', { ...response?.data })),
        tap(response => this.sendToClient(Event.NEW_TRANSACTION, { ...response?.data })),
        delay(10000),
        mergeMap(response =>
          from(this.transactionRepository.update(
            { confirmed: true },
            { where: { id: response.data.id } }
          )).pipe(
            tap(() => this.sendToClient(Event.TRANSACTION_CONFIRMED, { transactionId: response?.data?.id }))
          )
        )
      ).subscribe({
        next: () => {
          this._logger.debug('Transaction confirmed after 10 seconds');
          this.isProcessing = false;
        },
        error: (error) => {
          this.isProcessing = false;
          this._logger.error('Error processing transaction:', error);
        }
      });


  }

  sendToClient(event: Event, data: any) {
    this.eventGateway.emitToAllRegisteredUsers(event, data);
  }



}
