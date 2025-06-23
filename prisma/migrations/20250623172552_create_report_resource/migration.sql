-- AlterTable
ALTER TABLE "Resources" ADD COLUMN     "reports" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "ResourceReports" (
    "resource_id" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceReports_pkey" PRIMARY KEY ("resource_id","created_by")
);

-- AddForeignKey
ALTER TABLE "ResourceReports" ADD CONSTRAINT "ResourceReports_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceReports" ADD CONSTRAINT "ResourceReports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
