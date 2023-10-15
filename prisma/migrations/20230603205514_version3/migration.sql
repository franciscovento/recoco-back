/*
  Warnings:

  - Added the required column `updated_at` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CourseTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Degree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `DegreeCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `University` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `country_id` on the `University` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CourseTeacher" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Degree" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DegreeCourse" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "country_id",
ADD COLUMN     "country_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
