-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('exams', 'resumes', 'books', 'videos', 'other');

-- CreateTable
CREATE TABLE "Resources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" "ResourceCategory" NOT NULL DEFAULT 'other',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "course_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resources_id_key" ON "Resources"("id");

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_course_id_teacher_id_fkey" FOREIGN KEY ("course_id", "teacher_id") REFERENCES "CourseTeacher"("course_id", "teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
