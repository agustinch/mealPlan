/*
  Warnings:

  - You are about to drop the column `created` on the `food_stock_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `meal_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_stock_transaction" DROP COLUMN "created",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "meal_history" DROP COLUMN "created",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
