/*
  Warnings:

  - You are about to drop the column `trainerId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `storno` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `roomReservation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mainTrainerId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_trainerId_fkey`;

-- DropForeignKey
ALTER TABLE `roomReservation` DROP FOREIGN KEY `roomReservation_roomId_fkey`;

-- DropIndex
DROP INDEX `Course_trainerId_fkey` ON `Course`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `trainerId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `mainTrainerId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `CourseRegistration` ADD COLUMN `couponId` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `discount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `storno`,
    ADD COLUMN `isCancelled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recipientId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Trainer` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `roomReservation`;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `amount` DOUBLE NULL,
    `percent` DOUBLE NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceRecipient` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PERSON', 'COMPANY') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `participantId` VARCHAR(191) NULL,

    INDEX `InvoiceRecipient_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomReservation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `RoomReservation_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseTrainers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseTrainers_AB_unique`(`A`, `B`),
    INDEX `_CourseTrainers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Area_deletedAt_idx` ON `Area`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Course_deletedAt_idx` ON `Course`(`deletedAt`);

-- CreateIndex
CREATE INDEX `CourseRegistration_deletedAt_idx` ON `CourseRegistration`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Participant_deletedAt_idx` ON `Participant`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Program_deletedAt_idx` ON `Program`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Room_deletedAt_idx` ON `Room`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Trainer_deletedAt_idx` ON `Trainer`(`deletedAt`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_mainTrainerId_fkey` FOREIGN KEY (`mainTrainerId`) REFERENCES `Trainer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseRegistration` ADD CONSTRAINT `CourseRegistration_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `InvoiceRecipient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceRecipient` ADD CONSTRAINT `InvoiceRecipient_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomReservation` ADD CONSTRAINT `RoomReservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseTrainers` ADD CONSTRAINT `_CourseTrainers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseTrainers` ADD CONSTRAINT `_CourseTrainers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Trainer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
