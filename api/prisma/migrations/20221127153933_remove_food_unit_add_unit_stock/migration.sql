/*
  Warnings:

  - You are about to drop the `food_unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `show_on_list` to the `food_user_stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `food_user_stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "food_unit" DROP CONSTRAINT "food_unit_food_id_fkey";

-- DropForeignKey
ALTER TABLE "food_unit" DROP CONSTRAINT "food_unit_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "food_unit" DROP CONSTRAINT "food_unit_user_id_fkey";

-- AlterTable
ALTER TABLE "food_user_stock" ADD COLUMN     "show_on_list" BOOLEAN NOT NULL,
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "food_unit";

-- AddForeignKey
ALTER TABLE "food_user_stock" ADD CONSTRAINT "food_user_stock_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
