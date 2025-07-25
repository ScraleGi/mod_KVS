/*
  Warnings:

  - You are about to drop the `invoicerecipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
ALTER TABLE `CourseRegistration` DROP CONSTRAINT `CourseRegistration_invoiceRecipientId_fkey`;
DROP INDEX `CourseRegistration_invoiceRecipientId_fkey` ON `CourseRegistration`;

-- DropTable
DROP TABLE `invoicerecipient`;

-- CreateTable
CREATE TABLE `InvoiceRecipient` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PERSON', 'COMPANY') NOT NULL,
    `recipientSalutation` VARCHAR(191) NULL,
    `recipientName` VARCHAR(191) NULL,
    `recipientSurname` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `recipientEmail` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `recipientCity` VARCHAR(191) NOT NULL,
    `recipientStreet` VARCHAR(191) NOT NULL,
    `recipientCountry` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `InvoiceRecipient_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_invoiceRecipientId_fkey` FOREIGN KEY (`invoiceRecipientId`) REFERENCES `InvoiceRecipient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
