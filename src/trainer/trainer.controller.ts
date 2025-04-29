/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { getCurrentUser } from '../common/decorator/getCurrentUser.decorator';
import { QueryFilter } from '../common/types/common.types';
import { ICurrentUser } from '../common/types/data.type';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { TrainerService } from './trainer.service';

@Controller('trainers')
@ApiTags('Trainers')
@ApiBearerAuth('bearer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) { }

  @Post()
  create(
    @Body() createTrainerDto: CreateTrainerDto,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.trainerService.create(createTrainerDto, currentUser.id);
  }

  @Get()
  findAll(
    @Query() query: QueryFilter,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.trainerService.findAll(currentUser.id, query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.trainerService.findOne(id, currentUser.id);
  }

  @Get(':id/availability/:date')
  getTrainerAvailability(
    @Param('id') id: string,
    @Param('date') date: string,
    // @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.trainerService.getTrainerAvailability(id, date);
  }


  @Get(':id/courses/:courseId/assign')
  assignTrainerToCourse(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
    // @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.trainerService.assignTrainerToCourse(id, courseId);
  }
}
