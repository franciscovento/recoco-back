/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CommentLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `course_id` on the `CommentLikes` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `CommentLikes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `CommentLikes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `comment_id` to the `CommentLikes` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `University` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_course_id_teacher_id_user_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_pkey",
DROP COLUMN "course_id",
DROP COLUMN "teacher_id",
DROP COLUMN "user_id",
ADD COLUMN     "comment_id" TEXT NOT NULL,
ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("comment_id", "created_by");

-- AlterTable
ALTER TABLE "University" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
