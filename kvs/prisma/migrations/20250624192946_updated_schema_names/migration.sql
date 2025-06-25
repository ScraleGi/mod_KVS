/*
  Warnings:

  - You are about to drop the column `areaId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `teachingUnits` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseDateId` on the `CourseRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `CourseRegistration` table. All the data in the column will be lost.
  - You are about to drop the `CourseDate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `programId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `CourseRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseRegistrationId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_areaId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseDate` DROP FOREIGN KEY `CourseDate_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseDate` DROP FOREIGN KEY `CourseDate_trainerId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseRegistration` DROP FOREIGN KEY `CourseRegistration_courseDateId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseRegistration` DROP FOREIGN KEY `CourseRegistration_invoiceId_fkey`;

-- DropIndex
DROP INDEX `Course_areaId_fkey` ON `Course`;

-- DropIndex
DROP INDEX `CourseRegistration_courseDateId_fkey` ON `CourseRegistration`;

-- DropIndex
DROP INDEX `CourseRegistration_invoiceId_fkey` ON `CourseRegistration`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `areaId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `price`,
    DROP COLUMN `teachingUnits`,
    ADD COLUMN `programId` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `trainerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CourseRegistration` DROP COLUMN `courseDateId`,
    DROP COLUMN `invoiceId`,
    ADD COLUMN `courseId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `courseRegistrationId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `CourseDate`;

-- CreateTable
CREATE TABLE `Program` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `teachingUnits` INTEGER NULL,
    `price` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `areaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_courseRegistrationId_fkey` FOREIGN KEY (`courseRegistrationId`) REFERENCES `CourseRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
