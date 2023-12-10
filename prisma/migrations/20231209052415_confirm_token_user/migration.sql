/*
  Warnings:

  - A unique constraint covering the columns `[name,faculty_id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,faculty_id]` on the table `Degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,university_id]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,last_name,university_id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,country_id]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[confirm_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `university_id` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey";

-- AlterTable
ALTER TABLE "CourseTeacher" ADD COLUMN     "teacher_class_name" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "university_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirm_token" TEXT,
ADD COLUMN     "profile_img" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "unique_course_by_faculty" ON "Course"("name", "faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_degree_by_faculty" ON "Degree"("name", "faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_faculty_by_university" ON "Faculty"("name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_teacher_by_university" ON "Teacher"("name", "last_name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_university_by_country" ON "University"("name", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirm_token_key" ON "User"("confirm_token");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey" FOREIGN KEY ("course_id", "teacher_id", "user_id") REFERENCES "Comment"("course_id", "teacher_id", "created_by") ON DELETE CASCADE ON UPDATE CASCADE;
