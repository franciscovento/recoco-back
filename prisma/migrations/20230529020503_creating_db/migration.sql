-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('normal', 'manager', 'super_user');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'deleted', 'blocked');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'draft', 'reported', 'deleted');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('approved', 'onReview', 'pending', 'deleted', 'spam', 'rejected');

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'normal',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "university_id" TEXT,
    "degree_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "website" TEXT,
    "phone" TEXT,
    "status" "Status" NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'draft',
    "university_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" DECIMAL(65,30),
    "status" "Status" NOT NULL DEFAULT 'draft',
    "faculty_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "score" INTEGER,
    "status" "Status" NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "short_name" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'approved',
    "course_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DegreeCourse" (
    "degree_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "DegreeCourse_pkey" PRIMARY KEY ("degree_id","course_id")
);

-- CreateTable
CREATE TABLE "CourseTeacher" (
    "course_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "totalComments" INTEGER NOT NULL,
    "hours_per_week" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("course_id","teacher_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "University_id_key" ON "University"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_id_key" ON "Faculty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Degree_id_key" ON "Degree"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "DegreeCourse" ADD CONSTRAINT "DegreeCourse_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "Degree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeCourse" ADD CONSTRAINT "DegreeCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
