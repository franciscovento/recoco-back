/*
  Warnings:

  - Added the required column `difficulty` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quality` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "difficulty" INTEGER NOT NULL,
ADD COLUMN     "quality" INTEGER NOT NULL,
ALTER COLUMN "likes" DROP NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0,
ALTER COLUMN "dislikes" DROP NOT NULL,
ALTER COLUMN "dislikes" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CourseTeacher" ALTER COLUMN "quality" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "totalComments" DROP NOT NULL,
ALTER COLUMN "totalComments" SET DEFAULT 0,
ALTER COLUMN "hours_per_week" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateTable
CREATE TABLE "CommentLikes" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("comment_id","user_id")
);

-- CreateTable
CREATE TABLE "CommentDisLikes" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentDisLikes_pkey" PRIMARY KEY ("comment_id","user_id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "CourseTeacher"("course_id", "teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLikes" ADD CONSTRAINT "CommentDisLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLikes" ADD CONSTRAINT "CommentDisLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
