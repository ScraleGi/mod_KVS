/*
  Warnings:

  - You are about to drop the column `address` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InvoiceRecipient` table. All the data in the column will be lost.
  - Added the required column `postalCode` to the `InvoiceRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientCity` to the `InvoiceRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientCountry` to the `InvoiceRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientEmail` to the `InvoiceRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientStreet` to the `InvoiceRecipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` MODIFY `amount` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `InvoiceRecipient` DROP COLUMN `address`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NULL,
    ADD COLUMN `recipientStreet` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientSurname` VARCHAR(191) NULL;
