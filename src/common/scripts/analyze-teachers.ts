import { comentariosBatch } from '../data/comentarios';

interface TeacherAnalysis {
  teacherName: string;
  normalizedName: string;
  commentCount: number;
  courses: string[];
  comments: string[];
}

// Function to normalize teacher names (same as in batch-upload.ts)
function normalizeTeacherName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, '') // Remove special characters except spaces
    .trim();
}

function analyzeTeacherComments(): void {
  console.log('🔍 Analizando comentarios por profesor...\n');

  const teachersMap = new Map<string, TeacherAnalysis>();

  // Process all comments and group by normalized teacher name
  comentariosBatch.forEach((comentario, index) => {
    // Skip empty comments
    if (!comentario.comment || comentario.comment.trim() === '') {
      return;
    }

    const normalizedName = normalizeTeacherName(comentario.teacher_name);

    if (!teachersMap.has(normalizedName)) {
      teachersMap.set(normalizedName, {
        teacherName: comentario.teacher_name, // Keep original name for display
        normalizedName,
        commentCount: 0,
        courses: [],
        comments: [],
      });
    }

    const teacher = teachersMap.get(normalizedName)!;
    teacher.commentCount++;

    // Add course if not already included
    if (!teacher.courses.includes(comentario.course_name)) {
      teacher.courses.push(comentario.course_name);
    }

    // Add comment (truncated for display)
    const truncatedComment =
      comentario.comment.length > 100
        ? comentario.comment.substring(0, 100) + '...'
        : comentario.comment;
    teacher.comments.push(`[${comentario.course_name}] ${truncatedComment}`);
  });

  // Convert to array and sort by comment count (descending)
  const teachers = Array.from(teachersMap.values()).sort(
    (a, b) => b.commentCount - a.commentCount,
  );

  // Statistics
  const totalTeachers = teachers.length;
  const teachersWithMultipleComments = teachers.filter(
    (t) => t.commentCount > 1,
  );
  const teachersWithOneComment = teachers.filter((t) => t.commentCount === 1);

  console.log('📊 ESTADÍSTICAS GENERALES:');
  console.log(`👨‍🏫 Total de profesores únicos: ${totalTeachers}`);
  console.log(
    `📚 Profesores con múltiples comentarios: ${
      teachersWithMultipleComments.length
    } (${((teachersWithMultipleComments.length / totalTeachers) * 100).toFixed(
      1,
    )}%)`,
  );
  console.log(
    `📝 Profesores con un solo comentario: ${teachersWithOneComment.length} (${(
      (teachersWithOneComment.length / totalTeachers) *
      100
    ).toFixed(1)}%)`,
  );

  console.log('\n📈 DISTRIBUCIÓN DE COMENTARIOS:');
  const distribution: Record<number, number> = {};
  teachers.forEach((teacher) => {
    distribution[teacher.commentCount] =
      (distribution[teacher.commentCount] || 0) + 1;
  });

  Object.entries(distribution)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .forEach(([commentCount, teacherCount]) => {
      console.log(
        `  ${commentCount} comentario${
          parseInt(commentCount) > 1 ? 's' : ''
        }: ${teacherCount} profesor${teacherCount > 1 ? 'es' : ''}`,
      );
    });

  // Show top 10 teachers with most comments
  if (teachersWithMultipleComments.length > 0) {
    console.log('\n🏆 TOP 10 PROFESORES CON MÁS COMENTARIOS:');
    teachersWithMultipleComments.slice(0, 10).forEach((teacher, index) => {
      console.log(
        `${index + 1}. ${teacher.teacherName} - ${
          teacher.commentCount
        } comentarios en ${teacher.courses.length} curso${
          teacher.courses.length > 1 ? 's' : ''
        }`,
      );
      console.log(`   Cursos: ${teacher.courses.join(', ')}`);
      console.log('');
    });
  }

  // Show some examples of teachers with multiple comments
  if (teachersWithMultipleComments.length > 0) {
    console.log('\n💬 EJEMPLOS DE PROFESORES CON MÚLTIPLES COMENTARIOS:');
    teachersWithMultipleComments.slice(0, 5).forEach((teacher) => {
      console.log(
        `\n👨‍🏫 ${teacher.teacherName} (${teacher.commentCount} comentarios):`,
      );
      teacher.comments.forEach((comment, index) => {
        console.log(`  ${index + 1}. ${comment}`);
      });
    });
  }

  console.log('\n✅ Análisis completado.');
}

// Execute the analysis
analyzeTeacherComments();
