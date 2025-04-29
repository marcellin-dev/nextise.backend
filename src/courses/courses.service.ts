/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResolveError } from '../common/errors';
import { SendEmail } from '../common/helpers/utils';
import { QueryFilter } from '../common/types/common.types';
import { LoggingService } from '../logging/logging.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext({ service: CoursesService.name });
  }

  async create(createCourseDto: CreateCourseDto, userId: string) {
    this.logger.log("Création d'un nouveau cours", {
      userId,
      courseData: createCourseDto,
    });

    // Vérification des conflits d'emploi du temps
    const conflicts = await this.checkScheduleConflicts(createCourseDto);
    if (conflicts.length > 0) {
      this.logger.warn("Conflit d'emploi du temps détecté", { conflicts });
      throw new ConflictException(ResolveError('SCHEDULE_CONFLICT'));
    }

    // Si un formateur est spécifié, vérifier sa disponibilité
    if (createCourseDto.trainer_id) {
      const isAvailable = await this.checkTrainerAvailability(
        createCourseDto.trainer_id,
        createCourseDto.date,
      );
      if (!isAvailable) {
        this.logger.warn('Formateur non disponible', {
          trainerId: createCourseDto.trainer_id,
        });
        throw new ConflictException(ResolveError('TRAINER_NOT_AVAILABLE'));
      }
    }

    const { trainer_id, ...courseData } = createCourseDto;
    const course = await this.prisma.course.create({
      data: {
        ...courseData,
        user: { connect: { id: userId } },
        trainer: trainer_id ? { connect: { id: trainer_id } } : undefined,
      },
      include: {
        trainer: true,
      },
    });

    // Si un formateur est assigné, envoyer une notification
    if (course.trainer) {
      await this.notifyTrainer(course);
    }

    return course;
  }

  async findAll(userId: string, query: QueryFilter) {
    const { page = 1, limit = 10, search, start, end } = query;
    const skip = (page - 1) * limit;

    const where = {
      user_id: userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(start && end && {
        date: {
          gte: start,
          lte: end,
        },
      }),
    };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: where as Prisma.CourseWhereInput,
        skip,
        take: limit,
        include: { trainer: true },
        orderBy: { date: 'asc' },
      }),
      this.prisma.course.count({ where: where as Prisma.CourseWhereInput }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, user_id: userId },
      include: { trainer: true },
    });

    if (!course) {
      throw new NotFoundException(ResolveError('COURSE_NOT_FOUND'));
    }

    return course;
  }

  private async checkScheduleConflicts(course: CreateCourseDto) {
    return this.prisma.course.findMany({
      where: {
        date: course.date,
        location: course.location,
        id: { not: course.trainer_id }, // Exclure le cours actuel si c'est une mise à jour
      },
    });
  }

  private async checkTrainerAvailability(trainerId: string, date: Date) {
    const existingCourse = await this.prisma.course.findFirst({
      where: {
        trainer_id: trainerId,
        date: date,
      },
    });

    return !existingCourse;
  }

  private async notifyTrainer(course: any) {
    const message = `
      <h1>Nouvelle assignation de cours</h1>
      <p>Bonjour ${course.trainer.name},</p>
      <p>Vous avez été assigné à un nouveau cours :</p>
      <ul>
        <li>Nom du cours : ${course.name}</li>
        <li>Date : ${course.date}</li>
        <li>Lieu : ${course.location}</li>
        <li>Sujet : ${course.subject}</li>
        <li>Nombre de participants : ${course.participants}</li>
        <li>Prix formateur : ${course.trainer_price}€</li>
      </ul>
    `;

    await SendEmail(
      course.trainer.email,
      message,
      'Nouvelle assignation de cours',
    );
  }

  async suggestBestTrainer(course: CreateCourseDto) {
    const trainers = await this.prisma.trainer.findMany({
      where: {
        training_subjects: {
          has: course.subject,
        },
      },
      include: {
        courses: {
          where: {
            date: course.date,
          },
        },
      },
    });

    // Filtrer les formateurs disponibles
    const availableTrainers = trainers.filter(
      (trainer) => trainer.courses.length === 0,
    );

    // Trier par localisation (plus proche d'abord)
    return availableTrainers.sort((a, b) => {
      if (a.location.includes(course.location)) return -1;
      if (b.location.includes(course.location)) return 1;
      return 0;
    });
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

  async assignTrainerToCourse(trainerId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(ResolveError('COURSE_NOT_FOUND'));
    }

    const trainer = await this.prisma.trainer.findUnique({
      where: { id: trainerId },
    });

    if (!trainer) {
      throw new NotFoundException(ResolveError('TRAINER_NOT_FOUND'));
    }

    //check if trainer is available at course date
    const isAvailable = await this.getTrainerAvailability(trainerId, course.date);
    if (!isAvailable) {
      throw new ConflictException(ResolveError('TRAINER_NOT_AVAILABLE'));
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: { trainer: { connect: { id: trainerId } } },
    });
  }
}
