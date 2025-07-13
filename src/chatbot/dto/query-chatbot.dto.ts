import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

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

  @IsUUID('4', { message: 'Session ID must be a valid UUIDv4' })
  @ApiProperty({
    description: 'Unique identifier for the user session',
    example: '123e4567-e89b-12d3-a456-42661417400',
    type: String,
    required: true,
  })
  sessionId: string;
}
