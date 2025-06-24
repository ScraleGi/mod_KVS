-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `teachingUnits` INTEGER NULL,
    `courseStart` DATETIME(3) NULL,
    `price` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
