-- AlterTable
ALTER TABLE `Area` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `deletedAt` DATETIME(3) NULL;
