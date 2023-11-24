-- CreateTable
CREATE TABLE "UniversityComment" (
    "user_id" TEXT NOT NULL,
    "university_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityComment_pkey" PRIMARY KEY ("user_id","university_id")
);

-- CreateTable
CREATE TABLE "FacultyComment" (
    "user_id" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyComment_pkey" PRIMARY KEY ("user_id","faculty_id")
);

-- CreateTable
CREATE TABLE "DegreeComent" (
    "user_id" TEXT NOT NULL,
    "degree_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreeComent_pkey" PRIMARY KEY ("user_id","degree_id")
);

-- AddForeignKey
ALTER TABLE "UniversityComment" ADD CONSTRAINT "UniversityComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityComment" ADD CONSTRAINT "UniversityComment_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyComment" ADD CONSTRAINT "FacultyComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyComment" ADD CONSTRAINT "FacultyComment_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeComent" ADD CONSTRAINT "DegreeComent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeComent" ADD CONSTRAINT "DegreeComent_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "Degree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
