-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "CourseTeacher" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Degree" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Faculty" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "University" ALTER COLUMN "status" SET DEFAULT 'active';
