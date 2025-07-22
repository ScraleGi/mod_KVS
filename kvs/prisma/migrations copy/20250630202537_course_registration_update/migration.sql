/*
  Warnings:

  - You are about to drop the column `couponId` on the `CourseRegistration` table. All the data in the column will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CourseRegistration` DROP FOREIGN KEY `CourseRegistration_couponId_fkey`;

-- DropIndex
DROP INDEX `CourseRegistration_couponId_fkey` ON `CourseRegistration`;

-- AlterTable
ALTER TABLE `CourseRegistration` DROP COLUMN `couponId`,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `discountRemark` VARCHAR(191) NULL,
    ADD COLUMN `generalRemark` VARCHAR(191) NULL,
    ADD COLUMN `infoSessionAt` DATETIME(3) NULL,
    ADD COLUMN `interestedAt` DATETIME(3) NULL,
    ADD COLUMN `registeredAt` DATETIME(3) NULL,
    ADD COLUMN `subsidyAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `subsidyRemark` VARCHAR(191) NULL,
    ADD COLUMN `unregisteredAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Coupon`;

-- RenameIndex
ALTER TABLE `CourseRegistration` RENAME INDEX `CourseRegistration_courseId_fkey` TO `CourseRegistration_courseId_idx`;

-- RenameIndex
ALTER TABLE `CourseRegistration` RENAME INDEX `CourseRegistration_participantId_fkey` TO `CourseRegistration_participantId_idx`;
