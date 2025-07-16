/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `discountAmount`,
    ADD COLUMN `finalAmount` DECIMAL(10, 2) NULL;
