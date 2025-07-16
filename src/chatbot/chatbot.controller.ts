import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { QueryChatDto } from './dto/query-chatbot.dto';

@Controller('chatbot')
@ApiTags('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async processQuery(@Body() queryDto: QueryChatDto) {
    return this.chatbotService.ask(
      queryDto.query,
      queryDto.sessionId,
      queryDto.facultyId,
    );
  }
}
