-- AlterTable
ALTER TABLE "_MedicineToPrescription" ADD CONSTRAINT "_MedicineToPrescription_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MedicineToPrescription_AB_unique";
