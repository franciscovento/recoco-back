-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Degree" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "University" ALTER COLUMN "status" DROP NOT NULL;
