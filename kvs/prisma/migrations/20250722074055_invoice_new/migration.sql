-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_courseRegistrationId_fkey`;

-- DropIndex
DROP INDEX `Invoice_courseRegistrationId_fkey` ON `invoice`;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `courseCode` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `discountRemark` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    ADD COLUMN `programName` VARCHAR(191) NULL,
    ADD COLUMN `programPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `recipientCity` VARCHAR(191) NULL,
    ADD COLUMN `recipientCountry` VARCHAR(191) NULL,
    ADD COLUMN `recipientEmail` VARCHAR(191) NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NULL,
    ADD COLUMN `recipientSalutation` VARCHAR(191) NULL,
    ADD COLUMN `recipientStreet` VARCHAR(191) NULL,
    ADD COLUMN `recipientSurname` VARCHAR(191) NULL,
    ADD COLUMN `subsidyAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `subsidyRemark` VARCHAR(191) NULL,
    MODIFY `amount` DECIMAL(10, 2) NULL,
    MODIFY `courseRegistrationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_courseRegistrationId_fkey` FOREIGN KEY (`courseRegistrationId`) REFERENCES `CourseRegistration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
