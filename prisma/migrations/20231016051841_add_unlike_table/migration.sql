/*
  Warnings:

  - You are about to drop the column `boolean` on the `CommentLikes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommentLikes" DROP COLUMN "boolean";

-- CreateTable
CREATE TABLE "CommentDisLikes" (
    "course_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentDisLikes_pkey" PRIMARY KEY ("course_id","teacher_id","user_id")
);

-- AddForeignKey
ALTER TABLE "CommentDisLikes" ADD CONSTRAINT "CommentDisLikes_course_id_teacher_id_user_id_fkey" FOREIGN KEY ("course_id", "teacher_id", "user_id") REFERENCES "Comment"("course_id", "teacher_id", "created_by") ON DELETE RESTRICT ON UPDATE CASCADE;
