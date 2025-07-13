import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { OpenAIProvider } from '../common/openapi/openapi.provider';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, OpenAIProvider],
  imports: [PrismaModule, ChatbotModule],
  exports: [CommentService],
})
export class CommentModule {}
