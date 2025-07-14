/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `discountAmount`,
    ADD COLUMN `finalAmount` DECIMAL(10, 2) NULL;
