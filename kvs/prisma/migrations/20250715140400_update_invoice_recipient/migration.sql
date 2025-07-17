/*
  Warnings:

  - You are about to drop the column `companyId` on the `courseregistration` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `invoicerecipient` table. All the data in the column will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `courseregistration` DROP FOREIGN KEY `CourseRegistration_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicerecipient` DROP FOREIGN KEY `InvoiceRecipient_participantId_fkey`;

-- DropIndex
DROP INDEX `CourseRegistration_companyId_fkey` ON `courseregistration`;

-- DropIndex
DROP INDEX `Invoice_recipientId_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `InvoiceRecipient_participantId_fkey` ON `invoicerecipient`;

-- AlterTable
ALTER TABLE `courseregistration` DROP COLUMN `companyId`,
    ADD COLUMN `invoiceRecipientId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `recipientId`;

-- AlterTable
ALTER TABLE `invoicerecipient` DROP COLUMN `participantId`;

-- DropTable
DROP TABLE `company`;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_invoiceRecipientId_fkey` FOREIGN KEY (`invoiceRecipientId`) REFERENCES `InvoiceRecipient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
