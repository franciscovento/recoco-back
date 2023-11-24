-- AlterTable
ALTER TABLE "Degree" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "University" ALTER COLUMN "slug" DROP NOT NULL;
