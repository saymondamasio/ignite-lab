import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import slugify from 'slugify';
import { GraphQLError } from 'graphql';

interface CreateCourseParams {
  title: string;
}

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  listAllCourses() {
    return this.prismaService.course.findMany();
  }

  getCourseById(id: string) {
    return this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  async createCourse({ title }: CreateCourseParams) {
    const slug = slugify(title, { lower: true });

    const courseAlreadyExists = await this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseAlreadyExists) {
      throw new GraphQLError('Course already exists');
    }

    return this.prismaService.course.create({
      data: {
        title,
        slug,
      },
    });
  }
}
