/*
  Warnings:

  - You are about to alter the column `priceExcepted` on the `Meeting` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(8,2)`.
  - You are about to alter the column `priceFull` on the `Meeting` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "postalCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "priceExcepted" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "priceFull" SET DATA TYPE DECIMAL(8,2);
