import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChatHistoryMessageDto } from './chat-history-message.dto';

export class QueryChatDto {
  @ApiProperty({
    description: 'The query to process',
    example: 'What is the best way to learn programming?',
    type: String,
    required: true,
    default: 'Your question here',
  })
  @IsString()
  query: string;

  @IsNumber()
  @ApiProperty({
    description: 'Faculty ID to filter the query',
    example: 1,
    type: Number,
    required: true,
  })
  facultyId: number;

  @ApiPropertyOptional({
    description: 'Recent conversation messages for context',
    type: [ChatHistoryMessageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryMessageDto)
  history?: ChatHistoryMessageDto[];
}
