import { Module } from '@nestjs/common';
import { OpenAIProvider } from '../common/openapi/openapi.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, OpenAIProvider],
  imports: [PrismaModule, RedisModule],
  exports: [ChatbotService],
})
export class ChatbotModule {}
