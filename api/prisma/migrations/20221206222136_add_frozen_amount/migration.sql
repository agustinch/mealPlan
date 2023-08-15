/*
  Warnings:

  - You are about to drop the column `amount` on the `food_user_stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_user_stock" DROP COLUMN "amount",
ADD COLUMN     "allow_use_frozen_amount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fridge_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "frozen_amount" INTEGER,
ADD COLUMN     "frozen_quantity_per_package" INTEGER;
