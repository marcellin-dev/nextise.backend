/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { getCurrentUser } from '../common/decorator/getCurrentUser.decorator';
import { QueryFilter } from '../common/types/common.types';
import { ICurrentUser } from '../common/types/data.type';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
@ApiTags('Courses')
@ApiBearerAuth('bearer')

export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.coursesService.create(createCourseDto, currentUser.id);
  }

  @Get()
  findAll(
    @Query() query: QueryFilter,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.coursesService.findAll(currentUser.id, query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.coursesService.findOne(id, currentUser.id);
  }

  @Post('suggest-trainer')
  suggestBestTrainer(
    @Body() course: CreateCourseDto,
    // @getCurrentUser() currentUser: ICurrentUser,
  ) {
    return this.coursesService.suggestBestTrainer(course);
  }
}
