/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,faculty_id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,faculty_id]` on the table `Degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,university_id]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_id,name]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_faculty_id_key" ON "Course"("name", "faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "Degree_name_faculty_id_key" ON "Degree"("name", "faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_university_id_key" ON "Faculty"("name", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- CreateIndex
CREATE UNIQUE INDEX "University_country_id_name_key" ON "University"("country_id", "name");
