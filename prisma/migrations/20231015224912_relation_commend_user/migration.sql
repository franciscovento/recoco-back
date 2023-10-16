/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CommentDisLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_course_id_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_course_id_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_user_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("course_id", "teacher_id", "created_by");

-- AlterTable
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_pkey",
ADD CONSTRAINT "CommentDisLikes_pkey" PRIMARY KEY ("course_id", "teacher_id", "user_id");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey" FOREIGN KEY ("course_id", "teacher_id", "user_id") REFERENCES "Comment"("course_id", "teacher_id", "created_by") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLikes" ADD CONSTRAINT "CommentDisLikes_course_id_teacher_id_user_id_fkey" FOREIGN KEY ("course_id", "teacher_id", "user_id") REFERENCES "Comment"("course_id", "teacher_id", "created_by") ON DELETE RESTRICT ON UPDATE CASCADE;
