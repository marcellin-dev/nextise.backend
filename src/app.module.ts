/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';
import { HttpService } from './http/http.service';
import { LoggingModule } from './logging/logging.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TrainerModule } from './trainer/trainer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        `.env`,
      ],
      isGlobal: true,
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
    EventsModule,
    LoggingModule,
    SchedulerModule,
    HttpModule,
    CoursesModule,
    TrainerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService, HttpService],
})
export class AppModule { }
