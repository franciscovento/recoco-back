import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QueryChatDto } from './dto/query-chatbot.dto';

@Injectable()
export class ChatbotService {
  constructor(
    private prisma: PrismaService,
    @Inject('OPENAI') private readonly openai: OpenAI,
    private readonly redisService: RedisService,
  ) {}

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.log(`Error generating embedding: ${error.message}`);
      return null;
    }
  }

  async findSimilarCommentsWithVector(queryEmbedding: number[], limit = 5) {
    const embeddingString = `[${queryEmbedding.join(',')}]`;

    // Usar similitud coseno con operador <=>
    //   const result = await this.prisma.$queryRaw`
    //   SELECT
    //    comment,
    //     1 - (embedding <=> ${embeddingString}::vector) as similarity
    //   FROM "Comment"
    //   WHERE 1 - (embedding <=> ${embeddingString}::vector) > 0.7
    //   ORDER BY embedding <=> ${embeddingString}::vector
    //   LIMIT ${limit}
    // `;
    const result = await this.prisma.$queryRaw`
SELECT 
    c.comment,
    c.difficulty,
    c.quality,
    t.name AS teacher_name,
    t.last_name AS teacher_last_name,
    co.name AS course_name,
    1 - (c.embedding <=> ${embeddingString}::vector) as similarity
FROM "Comment" c
    JOIN "CourseTeacher" ct 
        ON c.course_id = ct.course_id AND c.teacher_id = ct.teacher_id
    JOIN "Teacher" t 
        ON ct.teacher_id = t.id
    JOIN "Course" co 
        ON ct.course_id = co.id
WHERE 1 - (embedding <=> ${embeddingString}::vector) > 0.5
ORDER BY c.embedding <=> ${embeddingString}::vector
LIMIT ${limit};
`;

    return result as Array<{
      comment: string;
      course_name: string;
      teacher_name: string;
      teacher_last_name: string;
      difficulty: number;
      quality: number;
      similarity: number;
    }>;
  }

  private async generateAnswer(
    question: string,
    relevantComments: Array<{
      comment: string;
      course_name: string;
      teacher_name: string;
      teacher_last_name: string;
      difficulty: number;
      quality: number;
      similarity: number;
    }>,
    sessionId: string,
  ): Promise<string> {
    const history = await this.redisService.getChatBotHistory(sessionId);

    const context = relevantComments
      .map(
        (result) =>
          `Comentario: ${result.comment}, Dificultad: ${result.difficulty}, Calidad: ${result.quality}, Profesor: ${result.teacher_name} ${result.teacher_last_name}, Curso: ${result.course_name}`,
      )
      .join('\n');

    const systemPrompt = `
    Eres un asistente llamado Recoco que ayuda a estudiantes a consultar información sobre profesores y materias basándote en comentarios de otros estudiantes.
    - Responde de manera natural y útil
    - Basa tu respuesta solo en la información proporcionada
    - Si no hay información suficiente, indícalo claramente
    - Sé objetivo y balanceado en tus respuestas
    - Menciona nombres de profesores y materias cuando sea relevante, siempre y cuando aparezcan en los comentarios relevantes
    - No inventes información, usa solo lo que está en los comentarios
    - Si el usuario pregunta algo que no esté relacionado con profesores o materias, responde: "Soy Recoco, tu asistente virtual para ayudarte con dudas sobre profesores o materias. Hazme una pregunta relacionada con eso para poder ayudarte."
    `;

    const prompt = `
    Contexto de comentarios relevantes:
    ${context}

    Pregunta del estudiante: ${question}

    Respuesta:`;

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: prompt },
    ];

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: messages,
      max_tokens: 300,
      temperature: 0.2,
    });

    // Guardar el mensaje de usuario en Redis
    await this.redisService.addMessageToChatbotHistory(
      sessionId,
      'user',
      question,
    );

    // Guardar el mensaje de respuesta en Redis
    await this.redisService.addMessageToChatbotHistory(
      sessionId,
      'assistant',
      completion.choices[0].message.content,
    );

    return completion.choices[0].message.content;
  }

  async processQuery(queryDto: QueryChatDto) {
    try {
      // 1. Generar embedding de la pregunta
      const queryEmbedding = await this.generateEmbedding(queryDto.query);

      // 2. Buscar comentarios similares usando pgvector
      const relevantComments = await this.findSimilarCommentsWithVector(
        queryEmbedding,
        5,
      );

      // 3. Generar respuesta con OpenAI
      const answer = await this.generateAnswer(
        queryDto.query,
        relevantComments,
        queryDto.sessionId,
      );

      // 4. Calcular confianza promedio
      const confidence =
        relevantComments.length > 0
          ? relevantComments.reduce((sum, c) => sum + c.similarity, 0) /
            relevantComments.length
          : 0;

      return {
        answer,
        confidence,
        sources: relevantComments,
        queryId: queryDto.sessionId,
      };
    } catch (error) {
      throw new Error(`Error processing query: ${error.message}`);
    }
  }
}
