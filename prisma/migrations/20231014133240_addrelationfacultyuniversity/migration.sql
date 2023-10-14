-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
