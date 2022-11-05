/*
  Warnings:

  - Added the required column `created` to the `meal_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meal_history" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL;
