/*
  Warnings:

  - The primary key for the `CommentLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_pkey",
ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("course_id", "teacher_id", "user_id");
