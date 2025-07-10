/*
  Warnings:

  - Added the required column `discountAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `discountAmount` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `invoicerecipient` ADD COLUMN `recipientSalutation` VARCHAR(191) NULL;
