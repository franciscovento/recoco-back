import { Injectable } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { CourseService } from 'src/course/course.service';
import { CreateCourseDegree } from 'src/course/dto/create-course-degree';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';
import { TeacherClassService } from 'src/teacher-class/teacher-class.service';

@Injectable()
export class AnonymsService {
  anonymsUserID: string;
  user: UserRequest;
  constructor(
    private commentService: CommentService,
    private teacherClass: TeacherClassService,
    private courseService: CourseService,
  ) {
    this.anonymsUserID = process.env.ANONYMOUS_USER_ID;
    this.user = {
      sub: this.anonymsUserID,
      username: 'Anonymous',
      rol: 'normal',
      isVerified: true,
    };
  }

  async createComment(createCommentDto: CreateCommentDto) {
    try {
      const response = await this.commentService.create(
        createCommentDto,
        this.user,
      );
      return {
        message: 'Comment created',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async createTeacherClass(teacherClassDto: CreateTeacherClassDto) {
    try {
      const response = await this.teacherClass.create(
        teacherClassDto,
        this.user,
      );
      return {
        message: 'Teacher class created',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async createCourseWithDegree(createCourseDegree: CreateCourseDegree) {
    try {
      const response = await this.courseService.createWithDegree(
        createCourseDegree,
        this.user,
      );
      return {
        message: 'Course created',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }
}
