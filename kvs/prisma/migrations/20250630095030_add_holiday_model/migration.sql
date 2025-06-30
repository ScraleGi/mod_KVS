/*
  Warnings:

  - You are about to drop the column `createdAt` on the `holiday` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,date]` on the table `Holiday` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `holiday` DROP COLUMN `createdAt`;

-- CreateIndex
CREATE UNIQUE INDEX `Holiday_title_date_key` ON `Holiday`(`title`, `date`);
