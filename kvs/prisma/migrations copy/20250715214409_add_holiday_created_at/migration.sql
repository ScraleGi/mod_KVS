/*
  Warnings:

  - You are about to drop the `invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoicerecipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_courseRegistrationId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicerecipient` DROP FOREIGN KEY `InvoiceRecipient_participantId_fkey`;

-- DropIndex
DROP INDEX `Holiday_title_date_key` ON `Holiday`;

-- AlterTable
ALTER TABLE `Holiday` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `invoice`;

-- DropTable
DROP TABLE `invoicerecipient`;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `finalAmount` DECIMAL(10, 2) NULL,
    `courseRegistrationId` VARCHAR(191) NOT NULL,
    `isCancelled` BOOLEAN NOT NULL DEFAULT false,
    `dueDate` DATETIME(3) NOT NULL,
    `transactionNumber` VARCHAR(191) NULL,
    `recipientId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    UNIQUE INDEX `Invoice_transactionNumber_key`(`transactionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `participantId` VARCHAR(191) NULL,

    INDEX `InvoiceRecipient_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseHoliday` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `courseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CourseHoliday_courseId_date_key`(`courseId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSpecialDays` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `pauseDuration` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `courseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CourseSpecialDays_courseId_startTime_key`(`courseId`, `startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseRythm` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `weekDay` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `pauseDuration` TIME NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `courseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CourseRythm_courseId_weekDay_key`(`courseId`, `weekDay`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_courseRegistrationId_fkey` FOREIGN KEY (`courseRegistrationId`) REFERENCES `CourseRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `InvoiceRecipient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceRecipient` ADD CONSTRAINT `InvoiceRecipient_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseHoliday` ADD CONSTRAINT `CourseHoliday_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSpecialDays` ADD CONSTRAINT `CourseSpecialDays_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRythm` ADD CONSTRAINT `CourseRythm_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
