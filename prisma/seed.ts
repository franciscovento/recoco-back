// seeds.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  await createCountries();
  await createUsers();
  await createUniversities();
  await createFaculties();
  await createDegrees();
  await createTeachers();
  await createCourses();
  await createCourseTeachers();
  await createComments();
  await createDegreeCourses();

  console.log('✅ Seed completado exitosamente!');
}

async function createCountries() {
  console.log('📍 Creando países...');
  const americaCountries = [
    { name: 'Argentina' },
    { name: 'Bolivia' },
    { name: 'Brazil' },
    { name: 'Canada' },
    { name: 'Chile' },
    { name: 'Colombia' },
    { name: 'Costa Rica' },
    { name: 'Cuba' },
    { name: 'Dominican Republic' },
    { name: 'Ecuador' },
    { name: 'El Salvador' },
    { name: 'Guatemala' },
    { name: 'Haiti' },
    { name: 'Honduras' },
    { name: 'Jamaica' },
    { name: 'Mexico' },
    { name: 'Nicaragua' },
    { name: 'Panama' },
    { name: 'Paraguay' },
    { name: 'Peru' },
    { name: 'Puerto Rico' },
    { name: 'United States' },
    { name: 'Uruguay' },
    { name: 'Venezuela' },
  ];

  for (const country of americaCountries) {
    await prisma.country.upsert({
      where: { name: country.name },
      update: {},
      create: {
        name: country.name,
      },
    });
  }
  console.log('✅ Países creados');
}

async function createUsers() {
  console.log('👤 Creando usuarios...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Usuario administrador
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@recoco.com' },
    update: {},
    create: {
      email: 'admin@recoco.com',
      password: hashedPassword,
      username: 'admin',
      rol: 'super_user',
      status: 'active',
      is_verified: true,
    },
  });

  // Usuario normal
  const normalUser = await prisma.user.upsert({
    where: { email: 'user@recoco.com' },
    update: {},
    create: {
      email: 'user@recoco.com',
      password: hashedPassword,
      username: 'usuario_test',
      rol: 'normal',
      status: 'active',
      is_verified: true,
    },
  });

  // Usuario anónimo con ID específico
  const anonymousId =
    process.env.ANONYMOUS_USER_ID || '5e8d9dec-963f-4a39-989e-d01e3ea82263';
  const anonymousUser = await prisma.user.upsert({
    where: { id: anonymousId },
    update: {},
    create: {
      id: anonymousId,
      email: 'anonymous@recoco.com',
      password: hashedPassword,
      username: 'anonymous',
      rol: 'normal',
      status: 'active',
      is_verified: true,
    },
  });

  console.log('✅ Usuarios creados');
  return { adminUser, normalUser, anonymousUser };
}

async function createUniversities() {
  console.log('🏛️ Creando universidades...');

  const argentina = await prisma.country.findUnique({
    where: { name: 'Argentina' },
  });

  if (!argentina) {
    throw new Error('País Argentina no encontrado');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const university = await prisma.university.upsert({
    where: { slug: 'uba-universidad-buenos-aires' },
    update: {},
    create: {
      name: 'Universidad de Buenos Aires',
      website: 'https://www.uba.ar',
      phone: '+54 11 5285-0000',
      slug: 'uba-universidad-buenos-aires',
      country_id: argentina.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Universidades creadas');
  return university;
}

async function createFaculties() {
  console.log('🎓 Creando facultades...');
  const university = await prisma.university.findUnique({
    where: { slug: 'uba-universidad-buenos-aires' },
  });

  if (!university) {
    throw new Error('Universidad UBA no encontrada');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const faculty = await prisma.faculty.upsert({
    where: { slug: 'fce-facultad-ciencias-economicas' },
    update: {},
    create: {
      name: 'Facultad de Ciencias Económicas',
      slug: 'fce-facultad-ciencias-economicas',
      university_id: university.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Facultades creadas');
  return faculty;
}

async function createDegrees() {
  console.log('📚 Creando carreras...');

  const faculty = await prisma.faculty.findUnique({
    where: { slug: 'fce-facultad-ciencias-economicas' },
  });

  if (!faculty) {
    throw new Error('Facultad FCE no encontrada');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const degree = await prisma.degree.upsert({
    where: { slug: 'contador-publico' },
    update: {},
    create: {
      name: 'Contador Público',
      description:
        'Carrera de Contador Público con orientación en auditoría y finanzas',
      duration: 5.0,
      slug: 'contador-publico',
      faculty_id: faculty.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Carreras creadas');
  return degree;
}

async function createTeachers() {
  console.log('👨‍🏫 Creando profesores...');

  const university = await prisma.university.findUnique({
    where: { slug: 'uba-universidad-buenos-aires' },
  });

  if (!university) {
    throw new Error('Universidad UBA no encontrada');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const teacher = await prisma.teacher.upsert({
    where: {
      name_last_name_university_id: {
        name: 'Juan',
        last_name: 'Pérez',
        university_id: university.id,
      },
    },
    update: {},
    create: {
      name: 'Juan',
      last_name: 'Pérez',
      score: 85,
      university_id: university.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Profesores creados');
  return teacher;
}

async function createCourses() {
  console.log('📖 Creando cursos...');

  const faculty = await prisma.faculty.findUnique({
    where: { slug: 'fce-facultad-ciencias-economicas' },
  });

  if (!faculty) {
    throw new Error('Facultad FCE no encontrada');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const course = await prisma.course.upsert({
    where: {
      name_faculty_id: {
        name: 'Contabilidad General',
        faculty_id: faculty.id,
      },
    },
    update: {},
    create: {
      name: 'Contabilidad General',
      description:
        'Curso introductorio a los principios fundamentales de la contabilidad',
      short_name: 'CG',
      course_code: 'CONT101',
      faculty_id: faculty.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Cursos creados');
  return course;
}

async function createCourseTeachers() {
  console.log('🔗 Asociando cursos con profesores...');

  const course = await prisma.course.findFirst({
    where: { name: 'Contabilidad General' },
  });

  if (!course) {
    throw new Error('Curso Contabilidad General no encontrado');
  }

  const teacher = await prisma.teacher.findFirst({
    where: { name: 'Juan' },
  });

  if (!teacher) {
    throw new Error('Profesor Juan Pérez no encontrado');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const courseTeacher = await prisma.courseTeacher.upsert({
    where: {
      course_id_teacher_id: {
        course_id: course.id,
        teacher_id: teacher.id,
      },
    },
    update: {},
    create: {
      course_id: course.id,
      teacher_id: teacher.id,
      teacher_class_name: 'Contabilidad General - Comisión A',
      quality: 4.2,
      difficulty: 3.5,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Asociaciones curso-profesor creadas');
  return courseTeacher;
}

async function createComments() {
  console.log('💬 Creando comentarios...');

  const course = await prisma.course.findFirst({
    where: { name: 'Contabilidad General' },
  });

  if (!course) {
    throw new Error('Curso Contabilidad General no encontrado');
  }

  const teacher = await prisma.teacher.findFirst({
    where: { name: 'Juan' },
  });

  if (!teacher) {
    throw new Error('Profesor Juan Pérez no encontrado');
  }

  const normalUser = await prisma.user.findUnique({
    where: { email: 'user@recoco.com' },
  });

  if (!normalUser) {
    throw new Error('Usuario normal no encontrado');
  }

  const comment = await prisma.comment.upsert({
    where: { id: 'seed-comment-1' },
    update: {},
    create: {
      id: 'seed-comment-1',
      comment:
        'Excelente profesor, explica muy bien los conceptos básicos de contabilidad. Las clases son dinámicas y siempre está disponible para consultas.',
      difficulty: 3,
      quality: 5,
      course_id: course.id,
      teacher_id: teacher.id,
      created_by: normalUser.id,
    },
  });

  // Crear like para el comentario
  const commentLike = await prisma.commentLikes.upsert({
    where: {
      comment_id_created_by: {
        comment_id: comment.id,
        created_by: normalUser.id,
      },
    },
    update: {},
    create: {
      comment_id: comment.id,
      created_by: normalUser.id,
      is_like: true,
    },
  });

  console.log('✅ Comentarios y likes creados');
  return { comment, commentLike };
}

async function createDegreeCourses() {
  console.log('🎯 Asociando carreras con cursos...');

  const degree = await prisma.degree.findUnique({
    where: { slug: 'contador-publico' },
  });

  if (!degree) {
    throw new Error('Carrera Contador Público no encontrada');
  }

  const course = await prisma.course.findFirst({
    where: { name: 'Contabilidad General' },
  });

  if (!course) {
    throw new Error('Curso Contabilidad General no encontrado');
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@recoco.com' },
  });

  if (!adminUser) {
    throw new Error('Usuario admin no encontrado');
  }

  const degreeCourse = await prisma.degreeCourse.upsert({
    where: {
      degree_id_course_id: {
        degree_id: degree.id,
        course_id: course.id,
      },
    },
    update: {},
    create: {
      degree_id: degree.id,
      course_id: course.id,
      created_by: adminUser.id,
    },
  });

  console.log('✅ Asociaciones carrera-curso creadas');
  return degreeCourse;
}

main()
  .catch((error) => {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
