import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { getEncoding } from 'tiktoken-node';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { getRelevantCommentsFunction } from './functions/getRelevantComments';

@Injectable()
export class ChatbotService {
  // private model = 'gpt-3.5-turbo'; // Cambia el modelo según tus necesidades
  private model = 'gpt-3.5-turbo'; // Cambia el modelo según tus necesidades
  private tokenizer = getEncoding('cl100k_base');
  private max_tokens = 150;
  constructor(
    private prisma: PrismaService,
    @Inject('OPENAI') private readonly openai: OpenAI,
    private readonly redisService: RedisService,
  ) {}

  validateTokens(text: string): boolean {
    const tokens = this.tokenizer.encode(text);
    return tokens.length <= this.max_tokens;
  }

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

  async findSimilarCommentsWithVector(
    queryEmbedding: number[],
    limit = 8,
    facultyId: number,
  ) {
    // const embeddingString = `[${queryEmbedding.join(',')}]`;
    //     const result = await this.prisma.$queryRaw`
    //       SELECT
    //           c.comment,
    //           c.difficulty,
    //           c.quality,
    //           t.name AS teacher_name,
    //           t.last_name AS teacher_last_name,
    //           co.name AS course_name,
    //           1 - (c.embedding <=> ${embeddingString}::vector) as similarity
    //       FROM "Comment" c
    //           JOIN "CourseTeacher" ct
    //               ON c.course_id = ct.course_id AND c.teacher_id = ct.teacher_id
    //           JOIN "Teacher" t
    //               ON ct.teacher_id = t.id
    //           JOIN "Course" co
    //               ON ct.course_id = co.id
    //       WHERE co.faculty_id = ${facultyId}
    //       ORDER BY c.embedding <=> ${embeddingString}::vector
    //       LIMIT ${limit};
    // `;

    const result = await this.prisma.$queryRawUnsafe(
      `
       SELECT 
        c.id,
        c.comment,
        c.difficulty,
        c.quality,
        t.name AS teacher_name,
        t.last_name AS teacher_last_name,
        co.name AS course_name,
        1 - (c.embedding <=> $1::vector) AS similarity
      FROM "Comment" c
      JOIN "Teacher" t ON c.teacher_id = t.id
      JOIN "Course" co ON c.course_id = co.id
      WHERE c.embedding IS NOT NULL AND co.faculty_id = $2
      ORDER BY c.embedding <=> $1::vector
      LIMIT $3
`,
      queryEmbedding,
      facultyId,
      limit,
    );

    // console.log(result);

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

  async ask(query: string, sessionId: string, facultyId: number) {
    try {
      const facultyName = await this.prisma.faculty.findUnique({
        where: { id: facultyId },
      });
      // validate that query is not too much large
      if (!this.validateTokens(query)) {
        throw new NotAcceptableException(
          'Query is too long, please shorten it.',
        );
      }

      const history = await this.redisService.getChatBotHistory(sessionId);

      const systemPrompt = `
           Eres Recoco y estas diseñado para ayudar a estudiantes universitarios a tomar mejores decisiones sobre qué materias cursar y con qué profesores inscribirse, basándote en opiniones reales de otros estudiantes.
        - Saluda diciendo: Soy recoco y te ayudo a responder preguntas sobre profesores y materias de la facultad ${facultyName?.name}.
        - Cuando hables español prioriza usar español latino/argentino.
        - No respondas  preguntas fuera del contexto de recomendaciones de cursos y materias. 
        - Si preguntas algo fuera del este ámbito puedes responder lugares donde pueden encontrar la información que buscan, pero no respondas directamente.
        - Tu tono debe ser divertido cuando sea apropiado.
        Tu función principal es ofrecer:
        - Opiniones y recomendaciones sobre profesores o materias específicas basados en comentarios de estudiantes. 
        - Consejos para encarar materias que son llevadas por algún profesor, basado en los comentarios de estudiantes.
        - Si no hay información suficiente en los comentarios recopilados, indícalo claramente y sugiere al usuario a que pida ayuda a compañeros para que escriban comentarios en la plataforma.
        - Si no hay comentarios relevantes puedes ser que sea un profesor de otra facultad o que no haya comentarios de ese profesor.
        - No termines tu respuesta con otras preguntas. Solo responde conciso y deja el usuario haga otra pregunta si lo requiere.

        Responde usando formato Markdown para que pueda mostrarse bien en una página web.
    `;

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: query },
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        tools: [
          {
            type: 'function',
            function: getRelevantCommentsFunction,
          },
        ],
        tool_choice: 'auto', // esto le dice al modelo que puede decidir si usar la función
        max_completion_tokens: 300,
      });

      const m = completion.choices[0].message;

      if (m.tool_calls) {
        console.log('Function call detected:', m.tool_calls);

        // Modelo decidió llamar a función

        const functionName = m.tool_calls[0].function.name;
        // const args = JSON.parse(m.tool_calls[0].function.arguments);

        if (functionName === 'getRelevantComments') {
          const results = await this.findRelevantComments(query, 5, facultyId);

          const context = results
            .map(
              (result) =>
                `Comentario: ${result.comment}, Dificultad: ${result.difficulty}, Calidad: ${result.quality}, Profesor: ${result.teacher_name} ${result.teacher_last_name}, Curso: ${result.course_name}`,
            )
            .join('\n');

          const prompt = `
          Contexto de comentarios relevantes:
            ${context}

          Pregunta del estudiante: ${query}

          Respuesta:`;

          // Mandas estos resultados al modelo para que genere respuesta final
          const followUp = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
              ...messages,
              {
                role: 'function',
                name: functionName,
                content: prompt,
              },
            ],
            max_completion_tokens: 300,
          });

          const answer = followUp.choices[0].message.content;
          if (!answer) {
            throw new Error('OpenAI returned a null response');
          }

          await this.redisService.addMessageToChatbotHistory(
            sessionId,
            'user',
            query,
          );
          await this.redisService.addMessageToChatbotHistory(
            sessionId,
            'assistant',
            answer,
          );
          return {
            message: 'Respuesta generada con función',
            data: {
              answer,
            },
          };
        }
      } else {
        const answer = completion.choices[0].message.content;
        await this.redisService.addMessageToChatbotHistory(
          sessionId,
          'user',
          query,
        );

        await this.redisService.addMessageToChatbotHistory(
          sessionId,
          'assistant',
          answer,
        );
        // Respuesta normal sin función
        return {
          message: 'Respuesta generada sin función',
          data: {
            answer,
          },
        };
      }
    } catch (error) {
      console.error('Error in ask method:', error);
      throw error;
    }
  }

  async findRelevantComments(query: string, limit = 5, facultyId?: number) {
    // 1. Generar embedding de la pregunta
    const queryEmbedding = await this.generateEmbedding(query);
    // 2. Buscar comentarios similares usando pgvector
    const relevantComments = await this.findSimilarCommentsWithVector(
      queryEmbedding,
      5,
      facultyId,
    );

    return relevantComments;
  }
}
