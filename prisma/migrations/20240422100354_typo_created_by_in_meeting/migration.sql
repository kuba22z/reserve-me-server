/*
  Warnings:

  - You are about to drop the column `employeeIdCreated` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `createdByExternalRefId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "employeeIdCreated",
ADD COLUMN     "createdByExternalRefId" TEXT NOT NULL;
