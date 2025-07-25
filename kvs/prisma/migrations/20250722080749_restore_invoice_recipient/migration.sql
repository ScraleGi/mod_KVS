/*
  Warnings:

  - Made the column `recipientEmail` on table `invoicerecipient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipientCountry` on table `invoicerecipient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoicerecipient` ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `recipientSalutation` VARCHAR(191) NULL,
    ADD COLUMN `recipientSurname` VARCHAR(191) NULL,
    MODIFY `recipientEmail` VARCHAR(191) NOT NULL,
    MODIFY `recipientCountry` VARCHAR(191) NOT NULL;
