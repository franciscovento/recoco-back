import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function main() {
  // Traer comentarios sin embedding, con info de teacher y course
  const comments: {
    id: string;
    comment: string;
    difficulty: number;
    quality: number;
    teacher_name: string | null;
    teacher_last_name: string | null;
    course_name: string | null;
  }[] = await prisma.$queryRaw`
    SELECT c.id, c.comment, c.difficulty, c.quality,
           t.name as teacher_name, t.last_name as teacher_last_name,
           co.name as course_name
    FROM "Comment" c
    JOIN "Teacher" t ON t.id = c.teacher_id
    JOIN "Course" co ON co.id = c.course_id
    WHERE c.embedding IS NULL
  `;

  console.log(`🔍 Procesando ${comments.length} comentarios`);

  for (const c of comments) {
    try {
      const embeddingText = `
      Profesor: ${c.teacher_name || ''} ${c.teacher_last_name || ''}
      Curso: ${c.course_name || ''}
      Comentario: ${c.comment}
      Dificultad: ${c.difficulty ?? 0}
      Calidad: ${c.quality ?? 0}
    `;

      console.log(embeddingText);

      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: embeddingText,
      });

      const embedding = response.data[0].embedding;

      // Guardar el embedding como vector (de forma segura)
      await prisma.$executeRaw`
        UPDATE "Comment"
        SET embedding = ${embedding}::vector
        WHERE id = ${c.id}
      `;

      console.log(`✅ Embedding guardado para id=${c.id}`);
    } catch (err: any) {
      console.error(`❌ Error al procesar id=${c.id}:`, err.message);
    }
  }

  await prisma.$disconnect();
  console.log('🏁 Listo.');
}

main();
