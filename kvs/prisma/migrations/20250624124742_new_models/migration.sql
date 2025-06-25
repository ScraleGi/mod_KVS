/*
  Warnings:

  - You are about to drop the column `courseStart` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `courseStart`;

-- CreateTable
CREATE TABLE `CourseDate` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `trainerId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trainer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseRegistration` (
    `id` VARCHAR(191) NOT NULL,
    `courseDateId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `status` ENUM('Interested', 'Registered', 'Started', 'Finished') NOT NULL,
    `invoiceId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseDate` ADD CONSTRAINT `CourseDate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseDate` ADD CONSTRAINT `CourseDate_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_courseDateId_fkey` FOREIGN KEY (`courseDateId`) REFERENCES `CourseDate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
