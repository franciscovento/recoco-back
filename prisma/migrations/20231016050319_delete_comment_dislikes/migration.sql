/*
  Warnings:

  - You are about to drop the `CommentDisLikes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boolean` to the `CommentLikes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_course_id_teacher_id_user_id_fkey";

-- AlterTable
ALTER TABLE "CommentLikes" ADD COLUMN     "boolean" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "CommentDisLikes";
