/*
  Warnings:

  - Added the required column `birthday` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salutation` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Trainer` ADD COLUMN `birthday` DATETIME(3) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `salutation` VARCHAR(191) NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL,
    ADD COLUMN `surname` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;
