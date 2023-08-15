/*
  Warnings:

  - You are about to drop the column `food_id` on the `meal_schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "meal_schedule" DROP CONSTRAINT "meal_schedule_food_id_fkey";

-- AlterTable
ALTER TABLE "meal_schedule" DROP COLUMN "food_id";
