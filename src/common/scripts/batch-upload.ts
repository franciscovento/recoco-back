import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { comentariosBatch } from '../data/comentarios';

dotenv.config();

const prisma = new PrismaClient();

interface CommentData {
  course_name: string;
  teacher_name: string;
  teacher_class_name: string;
  difficulty: number;
  quality: number;
  course_code: string;
  comment: string;
  created: string;
}

// const userIds = ['5e8d9dec-963f-4a39-989e-d01e3ea82263'];

function getRandomUserId(): string {
  // const idx = Math.floor(Math.random() * userIds.length);
  return '5e8d9dec-963f-4a39-989e-d01e3ea82263';
}

function normalizeTeacherName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

function splitTeacherName(name: string): {
  firstName: string;
  lastName: string;
} {
  const normalizedName = normalizeTeacherName(name);
  const nameParts = normalizedName.split(' ');
  const firstName = nameParts[0] || normalizedName;
  const lastName = nameParts.slice(1).join(' ') || '';

  return { firstName, lastName };
}

async function processBatchComments() {
  console.log(
    `🚀 Iniciando procesamiento de ${comentariosBatch.length} comentarios...`,
  );

  try {
    // Filter out comments with empty content before processing
    const validComments = comentariosBatch.filter((comentario) => {
      const isValid = comentario.comment && comentario.comment.trim() !== '';
      if (!isValid) {
        console.log(
          `⚠️ Comentario omitido (vacío): ${comentario.course_name} - ${comentario.teacher_name}`,
        );
      }
      return isValid;
    });

    console.log(
      `✅ Comentarios válidos para procesar: ${validComments.length} de ${comentariosBatch.length}`,
    );

    if (validComments.length === 0) {
      console.log('⚠️ No hay comentarios válidos para procesar.');
      return;
    }

    // Mapas para evitar duplicados y almacenar IDs
    const coursesMap = new Map<string, number>(); // key: course_name+course_code, value: course_id
    const teachersMap = new Map<string, number>(); // key: teacher_name, value: teacher_id
    const courseTeacherMap = new Map<string, boolean>(); // key: course_id+teacher_id, value: exists

    const FACULTY_ID = 1;
    const UNIVERSITY_ID = 1;

    console.log('📚 Paso 1: Creando cursos únicos...');

    // Obtener cursos únicos del batch
    const uniqueCourses = new Map<string, CommentData>();
    validComments.forEach((comentario: CommentData) => {
      const courseKey = `${comentario.course_name}|${comentario.course_code}`;
      if (!uniqueCourses.has(courseKey)) {
        uniqueCourses.set(courseKey, comentario);
      }
    });

    // Crear cursos
    for (const [courseKey, comentario] of uniqueCourses) {
      try {
        const course = await prisma.course.create({
          data: {
            name: comentario.course_name,
            short_name: '', // Limitar longitud
            course_code: comentario.course_code,
            faculty: {
              connect: {
                id: FACULTY_ID,
              },
            },
            user: {
              connect: {
                id: getRandomUserId(),
              },
            },
          },
        });
        coursesMap.set(courseKey, course.id);
        console.log(
          `✅ Curso creado: ${comentario.course_name} (ID: ${course.id})`,
        );
      } catch (error) {
        // Si el curso ya existe, intentamos encontrarlo
        try {
          const existingCourse = await prisma.course.findFirst({
            where: {
              name: comentario.course_name,
              course_code: comentario.course_code,
              faculty_id: FACULTY_ID,
            },
          });
          if (existingCourse) {
            coursesMap.set(courseKey, existingCourse.id);
            console.log(
              `ℹ️ Curso existente encontrado: ${comentario.course_name} (ID: ${existingCourse.id})`,
            );
          }
        } catch (findError) {
          console.error(
            `❌ Error al crear/encontrar curso ${comentario.course_name}:`,
            error,
          );
        }
      }
    }

    console.log('👨‍🏫 Paso 2: Creando profesores únicos...');

    // Obtener profesores únicos usando nombres normalizados
    const uniqueTeachers = new Map<string, string>(); // key: normalized_name, value: original_name
    validComments.forEach((comentario: CommentData) => {
      const normalizedName = normalizeTeacherName(comentario.teacher_name);
      if (!uniqueTeachers.has(normalizedName)) {
        uniqueTeachers.set(normalizedName, comentario.teacher_name);
      }
    });

    // Crear profesores
    for (const [normalizedName, originalName] of uniqueTeachers) {
      try {
        const { firstName, lastName } = splitTeacherName(originalName);

        const teacher = await prisma.teacher.create({
          data: {
            name: firstName,
            last_name: lastName,
            university: {
              connect: {
                id: UNIVERSITY_ID,
              },
            },
            user: {
              connect: {
                id: getRandomUserId(),
              },
            },
          },
        });
        teachersMap.set(normalizedName, teacher.id);
        console.log(
          `✅ Profesor creado: ${originalName} (normalizado: ${normalizedName}) (ID: ${teacher.id})`,
        );
      } catch (error) {
        // Si el profesor ya existe, intentamos encontrarlo
        try {
          const { firstName, lastName } = splitTeacherName(originalName);

          const existingTeacher = await prisma.teacher.findFirst({
            where: {
              name: firstName,
              last_name: lastName,
              university_id: UNIVERSITY_ID,
            },
          });
          if (existingTeacher) {
            teachersMap.set(normalizedName, existingTeacher.id);
            console.log(
              `ℹ️ Profesor existente encontrado: ${originalName} (normalizado: ${normalizedName}) (ID: ${existingTeacher.id})`,
            );
          }
        } catch (findError) {
          console.error(
            `❌ Error al crear/encontrar profesor ${originalName}:`,
            error,
          );
        }
      }
    }

    console.log('🔗 Paso 3: Creando asociaciones CourseTeacher...');

    // Crear asociaciones CourseTeacher únicas
    const uniqueAssociations = new Map<string, CommentData>();
    validComments.forEach((comentario: CommentData) => {
      const courseKey = `${comentario.course_name}|${comentario.course_code}`;
      const normalizedTeacherName = normalizeTeacherName(
        comentario.teacher_name,
      );
      const associationKey = `${courseKey}|${normalizedTeacherName}`;
      if (!uniqueAssociations.has(associationKey)) {
        uniqueAssociations.set(associationKey, comentario);
      }
    });

    for (const [, comentario] of uniqueAssociations) {
      const courseKey = `${comentario.course_name}|${comentario.course_code}`;
      const courseId = coursesMap.get(courseKey);
      const normalizedTeacherName = normalizeTeacherName(
        comentario.teacher_name,
      );
      const teacherId = teachersMap.get(normalizedTeacherName);

      if (courseId && teacherId) {
        try {
          await prisma.courseTeacher.create({
            data: {
              course_id: courseId,
              teacher_id: teacherId,
              teacher_class_name: comentario.teacher_class_name,
              created_by: getRandomUserId(),
            },
          });
          courseTeacherMap.set(`${courseId}|${teacherId}`, true);
          console.log(
            `✅ Asociación creada: Curso ${courseId} - Profesor ${teacherId}`,
          );
        } catch (error) {
          // La asociación ya existe
          courseTeacherMap.set(`${courseId}|${teacherId}`, true);
          console.log(
            `ℹ️ Asociación existente: Curso ${courseId} - Profesor ${teacherId}`,
          );
        }
      } else {
        console.error(
          `❌ No se pudo crear asociación para: ${comentario.course_name} - ${comentario.teacher_name}`,
        );
      }
    }

    console.log('💬 Paso 4: Agregando comentarios...');

    let commentsCreated = 0;
    let commentsSkipped = 0;

    // Use the original comentariosBatch with index-based processing
    for (let i = 0; i < comentariosBatch.length; i++) {
      const comentario = comentariosBatch[i];

      // Skip if comment is empty (same validation as at the beginning)
      if (!comentario.comment || comentario.comment.trim() === '') {
        commentsSkipped++;
        console.log(
          `⚠️ Comentario ${i} omitido (vacío): ${comentario.course_name} - ${comentario.teacher_name}`,
        );
        continue;
      }

      const courseKey = `${comentario.course_name}|${comentario.course_code}`;
      const courseId = coursesMap.get(courseKey);
      const normalizedTeacherName = normalizeTeacherName(
        comentario.teacher_name,
      );
      const teacherId = teachersMap.get(normalizedTeacherName);

      function scaleToFive(value: number): number {
        // Clamp value between 1 and 10, then scale to 1-5
        const clamped = Math.max(1, Math.min(10, value));
        return Math.round(((clamped - 1) / 9) * 4 + 1);
      }

      const scaledDifficulty = scaleToFive(comentario.difficulty);
      const scaledQuality = scaleToFive(comentario.quality);
      if (courseId && teacherId) {
        try {
          const randomUserId = getRandomUserId();
          await prisma.comment.create({
            data: {
              comment: comentario.comment,
              difficulty: scaledDifficulty,
              quality: scaledQuality,
              course_id: courseId,
              teacher_id: teacherId,
              created_by: randomUserId,
              created_at: new Date(comentario.created),
            },
          });
          commentsCreated++;

          if (commentsCreated % 100 === 0) {
            console.log(
              `📝 Comentarios creados: ${commentsCreated} (último: ${i}) - Usuario: ${randomUserId}`,
            );
          }
        } catch (error) {
          commentsSkipped++;
          console.error(`❌ Error al crear comentario ${i}:`, error);
        }
      } else {
        commentsSkipped++;
        console.error(
          `❌ No se pudo crear comentario ${i} para: ${comentario.course_name} - ${comentario.teacher_name}`,
        );
      }
    }

    console.log('\n🎉 Procesamiento completado:');
    console.log(`📚 Cursos únicos procesados: ${coursesMap.size}`);
    console.log(`👨‍🏫 Profesores únicos procesados: ${teachersMap.size}`);
    console.log(
      `🔗 Asociaciones CourseTeacher procesadas: ${courseTeacherMap.size}`,
    );
    console.log(`💬 Comentarios creados: ${commentsCreated}`);
    console.log(`⚠️ Comentarios omitidos: ${commentsSkipped}`);
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🏁 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar la función
processBatchComments();
