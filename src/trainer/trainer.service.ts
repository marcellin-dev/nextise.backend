/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResolveError } from '../common/errors';
import { QueryFilter } from '../common/types/common.types';
import { LoggingService } from '../logging/logging.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';

@Injectable()
export class TrainerService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext({ service: TrainerService.name });
  }

  async create(createTrainerDto: CreateTrainerDto, userId: string) {
    this.logger.log("Création d'un nouveau formateur", {
      userId,
      trainerData: createTrainerDto,
    });

    // Vérifier si l'email est déjà utilisé
    const existingTrainer = await this.prisma.trainer.findUnique({
      where: { email: createTrainerDto.email },
    });

    if (existingTrainer) {
      this.logger.warn('Email déjà utilisé', { email: createTrainerDto.email });
      throw new ConflictException(ResolveError('TRAINER_EMAIL_EXISTS'));
    }

    return this.prisma.trainer.create({
      data: {
        ...createTrainerDto,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string, query: QueryFilter) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      user_id: userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [trainers, total] = await Promise.all([
      this.prisma.trainer.findMany({
        where: where as Prisma.TrainerWhereInput,
        skip,
        take: limit,
        include: {
          courses: true,
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.trainer.count({ where: where as Prisma.TrainerWhereInput }),
    ]);

    return {
      data: trainers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const trainer = await this.prisma.trainer.findFirst({
      where: { id, user_id: userId },
      include: {
        courses: true,
      },
    });

    if (!trainer) {
      throw new NotFoundException(ResolveError('TRAINER_NOT_FOUND'));
    }

    return trainer;
  }

  async getTrainerAvailability(trainerId: string, date: string | Date) {
    //parse date or throw error
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(ResolveError('INVALID_DATE'));
    }
    const course = await this.prisma.course.findFirst({
      where: {
        trainer_id: trainerId,
        date: parsedDate,
      },
    });

    return !course;
  }


}
