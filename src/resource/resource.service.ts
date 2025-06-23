import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const resources = await this.prisma.resources.findMany();

    return {
      message: 'Resources retrieved',
      data: resources,
    };
  }

  async remove(resource_id: number, user: UserRequest) {
    try {
      const resource = await this.prisma.resources.findUnique({
        where: {
          id: resource_id,
        },
      });
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }
      if (resource.created_by !== user.sub) {
        throw new NotAcceptableException(
          'You are not allowed to delete this resource',
        );
      }
      const resourceDeleted = await this.prisma.resources.delete({
        where: {
          id: resource_id,
        },
      });
      return {
        message: 'Resource deleted',
        data: resourceDeleted,
      };
    } catch (error) {
      throw error;
    }
  }

  async report(resource_id: number, user: UserRequest) {
    try {
      const resource = await this.prisma.resources.findUnique({
        where: {
          id: resource_id,
        },
      });
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }
      const reportedResource = await this.prisma.resourceReports.create({
        data: {
          resource_id,
          created_by: user.sub,
        },
      });

      return {
        message: 'Resource reported',
        data: reportedResource,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeReport(resource_id: number, user: UserRequest) {
    try {
      const resourceDeleted = await this.prisma.resourceReports.delete({
        where: {
          resource_id_created_by: {
            created_by: user.sub,
            resource_id,
          },
        },
      });
      return {
        message: 'Resource reported deleted',
        data: resourceDeleted,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Resource not found');
      }
      throw error;
    }
  }
}
