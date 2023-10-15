/*
  Warnings:

  - Added the required column `faculty_id` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "faculty_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
