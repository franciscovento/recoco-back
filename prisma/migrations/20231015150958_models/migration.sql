/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `CommentDisLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comment_id` on the `CommentDisLikes` table. All the data in the column will be lost.
  - The primary key for the `CommentLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comment_id` on the `CommentLikes` table. All the data in the column will be lost.
  - You are about to drop the column `hours_per_week` on the `CourseTeacher` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `CommentDisLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `CommentDisLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `CommentLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `CommentLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `CourseTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `DegreeCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_comment_id_fkey";

-- DropIndex
DROP INDEX "Comment_id_key";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("course_id", "teacher_id");

-- AlterTable
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_pkey",
DROP COLUMN "comment_id",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL,
ADD CONSTRAINT "CommentDisLikes_pkey" PRIMARY KEY ("course_id", "teacher_id");

-- AlterTable
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_pkey",
DROP COLUMN "comment_id",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL,
ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("course_id", "teacher_id");

-- AlterTable
ALTER TABLE "CourseTeacher" DROP COLUMN "hours_per_week",
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DegreeCourse" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "Comment"("course_id", "teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLikes" ADD CONSTRAINT "CommentDisLikes_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "Comment"("course_id", "teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;
