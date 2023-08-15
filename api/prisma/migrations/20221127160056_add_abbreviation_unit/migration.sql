/*
  Warnings:

  - Added the required column `abbreviation` to the `unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "unit" ADD COLUMN     "abbreviation" TEXT NOT NULL;
