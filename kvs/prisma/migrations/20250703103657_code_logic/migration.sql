/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Area` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Program` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Trainer` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Area_code_key` ON `Area`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Participant_code_key` ON `Participant`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Program_code_key` ON `Program`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Trainer_code_key` ON `Trainer`(`code`);
