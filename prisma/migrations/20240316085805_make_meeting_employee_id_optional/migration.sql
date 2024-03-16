-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_employeeId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
