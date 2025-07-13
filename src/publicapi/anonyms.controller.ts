import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateCourseDegree } from 'src/course/dto/create-course-degree';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';
import { RedisService } from '../redis/redis.service';
import { CreateTeacherClassResourceDto } from '../teacher-class/dto/create-techar-class-resource.dto';
import { AnonymsService } from './anonyms.service';

@Controller('anonyms')
@ApiTags('anonyms')
export class AnonymsController {
  constructor(
    private readonly anonymsService: AnonymsService,
    private readonly redisService: RedisService,
  ) {}

  @Post('comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.anonymsService.createComment(createCommentDto);
  }

  @Post('teacher-class')
  createTeacherClass(@Body() createTeacherClassDto: CreateTeacherClassDto) {
    return this.anonymsService.createTeacherClass(createTeacherClassDto);
  }

  @Post('course/with-degree')
  createDegreeCourse(@Body() createDegreeCourseDto: CreateCourseDegree) {
    return this.anonymsService.createCourseWithDegree(createDegreeCourseDto);
  }

  @Post('teacher-class/resource')
  createResource(@Body() resourceDto: CreateTeacherClassResourceDto) {
    return this.anonymsService.createResource(resourceDto);
  }

  @Post('redis/test')
  async testRedis() {
    const testKey = 'test-key';
    const testValue = 'Hello, Redis!';

    // Set a value in Redis
    await this.redisService.set(testKey, testValue);

    // Get the value back from Redis
    const value = await this.redisService.get(testKey);

    return {
      message: 'Redis test successful',
      key: testKey,
      value: value,
    };
  }

  @Get('redis/test')
  async getRedisTest() {
    const testKey = '398c97b9-8c60-4b9f-a70a-364589f49552';

    // Get the value from Redis
    const value = await this.redisService.getChatBotHistory(testKey);

    return {
      message: 'Redis test successful',
      key: testKey,
      value: value,
    };
  }

  @Delete('redis/test')
  async deleteRedisTest() {
    const testKey = 'test-key';
    // Delete the key from Redis
    await this.redisService.del(testKey);
    return {
      message: 'Redis key deleted successfully',
      key: testKey,
    };
  }
}
