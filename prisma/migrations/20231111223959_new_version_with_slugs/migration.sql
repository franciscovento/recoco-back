/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CommentLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CourseTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Degree` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Degree` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `DegreeCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Faculty` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `University` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `University` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `course_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teacher_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `CommentLikes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teacher_id` on the `CommentLikes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `faculty_id` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `CourseTeacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teacher_id` on the `CourseTeacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `Degree` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `faculty_id` on the `Degree` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `degree_id` on the `DegreeCourse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `DegreeCourse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `university_id` on the `Faculty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `University` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_course_id_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_course_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "Degree" DROP CONSTRAINT "Degree_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "DegreeCourse" DROP CONSTRAINT "DegreeCourse_course_id_fkey";

-- DropForeignKey
ALTER TABLE "DegreeCourse" DROP CONSTRAINT "DegreeCourse_degree_id_fkey";

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_university_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("course_id", "teacher_id", "created_by");

-- AlterTable
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_pkey",
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL,
ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("course_id", "teacher_id", "user_id", "created_by");

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "faculty_id",
ADD COLUMN     "faculty_id" INTEGER NOT NULL,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_pkey",
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL,
ADD CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("course_id", "teacher_id");

-- AlterTable
ALTER TABLE "Degree" DROP CONSTRAINT "Degree_pkey",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "faculty_id",
ADD COLUMN     "faculty_id" INTEGER NOT NULL,
ADD CONSTRAINT "Degree_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DegreeCourse" DROP CONSTRAINT "DegreeCourse_pkey",
DROP COLUMN "degree_id",
ADD COLUMN     "degree_id" INTEGER NOT NULL,
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD CONSTRAINT "DegreeCourse_pkey" PRIMARY KEY ("degree_id", "course_id");

-- AlterTable
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_pkey",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "university_id",
ADD COLUMN     "university_id" INTEGER NOT NULL,
ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "University" DROP CONSTRAINT "University_pkey",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "University_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Degree_id_key" ON "Degree"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Degree_slug_key" ON "Degree"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_id_key" ON "Faculty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_slug_key" ON "Faculty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- CreateIndex
CREATE UNIQUE INDEX "University_id_key" ON "University"("id");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "CourseTeacher"("course_id", "teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey" FOREIGN KEY ("course_id", "teacher_id", "user_id") REFERENCES "Comment"("course_id", "teacher_id", "created_by") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeCourse" ADD CONSTRAINT "DegreeCourse_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "Degree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeCourse" ADD CONSTRAINT "DegreeCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
