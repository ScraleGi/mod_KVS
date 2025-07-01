/*
  Warnings:

  - Added the required column `endDate` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` ADD COLUMN `endDate` DATETIME(3) NOT NULL;
