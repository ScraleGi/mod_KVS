-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `courseRegistrationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_courseRegistrationId_fkey` FOREIGN KEY (`courseRegistrationId`) REFERENCES `CourseRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
