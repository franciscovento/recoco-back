/*
  Warnings:

  - You are about to drop the `CommentDisLikes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `is_like` to the `CommentLikes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentDisLikes" DROP CONSTRAINT "CommentDisLikes_course_id_teacher_id_user_id_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "disLikes" INTEGER DEFAULT 0,
ADD COLUMN     "likes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "CommentLikes" ADD COLUMN     "is_like" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "CommentDisLikes";
