/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `recipientSalutation` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `recipientSurname` on the `InvoiceRecipient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceRecipient` DROP FOREIGN KEY `InvoiceRecipient_participantId_fkey`;

-- DropIndex
DROP INDEX `Invoice_recipientId_fkey` ON `Invoice`;

-- DropIndex
DROP INDEX `InvoiceRecipient_participantId_fkey` ON `InvoiceRecipient`;

-- AlterTable
ALTER TABLE `CourseRegistration` ADD COLUMN `invoiceRecipientId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `recipientId`;

-- AlterTable
ALTER TABLE `InvoiceRecipient` DROP COLUMN `companyName`,
    DROP COLUMN `participantId`,
    DROP COLUMN `recipientSalutation`,
    DROP COLUMN `recipientSurname`,
    MODIFY `recipientEmail` VARCHAR(191) NULL,
    MODIFY `recipientCountry` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_invoiceRecipientId_fkey` FOREIGN KEY (`invoiceRecipientId`) REFERENCES `InvoiceRecipient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
