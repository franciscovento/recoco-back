import { Injectable } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UserRequest } from 'src/common/interfaces/userRequest.interface';
import { CreateTeacherClassDto } from 'src/teacher-class/dto/create-teacher-class.dto';
import { TeacherClassService } from 'src/teacher-class/teacher-class.service';

@Injectable()
export class AnonymsService {
  anonymsUserID: string;
  user: UserRequest;
  constructor(
    private commentService: CommentService,
    private teacherClass: TeacherClassService,
  ) {
    this.anonymsUserID = process.env.ANONYMOUS_USER_ID;
    this.user = {
      sub: this.anonymsUserID,
      username: 'Anonymous',
      rol: 'normal',
      isVerified: true,
    };
  }

  async createComment(
    teacher_id: number,
    course_id: number,
    createCommentDto: CreateCommentDto,
  ) {
    try {
      const response = await this.commentService.create(
        teacher_id,
        course_id,
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
}
