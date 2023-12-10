import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) {}
  async create(createDegreeDto: CreateDegreeDto, user: UserRequest) {
    try {
      const normalizedName = createDegreeDto.name.toLowerCase().trim();
      const degreeExist = await this.prisma.degree.findFirst({
        where: {
          faculty_id: createDegreeDto.faculty_id,
          name: normalizedName,
        },
      });

      if (degreeExist) {
        throw new UnprocessableEntityException(
          'This degree already exist in db',
        );
      }

      const degreeCreated = await this.prisma.degree.create({
        data: {
          ...createDegreeDto,
          name: normalizedName,
          created_by: user.sub,
        },
      });
      return {
        message: 'Degree created',
        data: {
          ...degreeCreated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const degrees = await this.prisma.degree.findMany({
        where: {
          status: 'active',
        },
      });
      return {
        message: 'Degrees retrieved',
        data: degrees,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllCourses(id: number) {
    try {
      const degreeCourses = await this.prisma.degreeCourse.findMany({
        where: {
          degree_id: id,
        },
        include: {
          course: true,
        },
      });
      return {
        message: 'Degree courses retrieved',
        data: degreeCourses,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByFaculty(facultyId: number) {
    try {
      const degreeByFaculty = await this.prisma.degree.findMany({
        where: {
          status: 'active',
          faculty_id: facultyId,
        },
      });
      return {
        message: 'Degrees retrieved',
        data: degreeByFaculty,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const degree = await this.prisma.degree.findUnique({
        where: { id },
        include: {
          faculty: {
            include: {
              university: true,
            },
          },
        },
      });
      if (!degree) throw new NotFoundException('Degree not found');
      return {
        message: 'Degree retrieved',
        data: degree,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateDegreeDto: UpdateDegreeDto,
    user: UserRequest,
  ) {
    try {
      const degree = await this.prisma.degree.findUnique({ where: { id } });
      if (!degree) throw new NotFoundException('Degree not found');
      if (degree.created_by !== user.sub)
        throw new NotFoundException('You cannot update this degree');
      const degreeUpdated = this.prisma.degree.update({
        where: { id },
        data: { ...updateDegreeDto },
      });
      return {
        message: 'Degree updated',
        data: {
          ...degreeUpdated,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async removeDegreeCourse(id: number, course_id: number, user: UserRequest) {
    try {
      const degreeCourse = await this.prisma.degreeCourse.findUnique({
        where: {
          degree_id_course_id: {
            course_id,
            degree_id: id,
          },
        },
      });
      if (!degreeCourse) throw new NotFoundException('Degree course not found');
      if (degreeCourse.created_by !== user.sub)
        throw new NotFoundException('You cannot delete this degree course');
      const degreeCourseDeleted = await this.prisma.degreeCourse.delete({
        where: {
          degree_id_course_id: {
            course_id,
            degree_id: id,
          },
        },
      });
      return {
        message: 'Degree course deleted',
        data: {
          ...degreeCourseDeleted,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, user: UserRequest) {
    try {
      const degree = await this.prisma.degree.findUnique({ where: { id } });
      if (!degree) throw new NotFoundException('Degree not found');
      if (degree.created_by !== user.sub)
        throw new NotFoundException('You cannot delete this degree');
      const degreeDeleted = this.prisma.degree.delete({
        where: { id },
      });

      return {
        message: 'Degree deleted',
        data: {
          ...degreeDeleted,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
