/*
  Warnings:

  - You are about to alter the column `difficulty` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `quality` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "difficulty" SET DATA TYPE INTEGER,
ALTER COLUMN "quality" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CourseTeacher" ALTER COLUMN "quality" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "difficulty" SET DATA TYPE DECIMAL(65,30);
