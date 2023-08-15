/*
  Warnings:

  - You are about to drop the `food_plate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_plate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `plate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "food_plate" DROP CONSTRAINT "food_plate_food_id_fkey";

-- DropForeignKey
ALTER TABLE "food_plate" DROP CONSTRAINT "food_plate_plate_id_fkey";

-- DropForeignKey
ALTER TABLE "user_plate" DROP CONSTRAINT "user_plate_plate_id_fkey";

-- DropForeignKey
ALTER TABLE "user_plate" DROP CONSTRAINT "user_plate_user_id_fkey";

-- AlterTable
ALTER TABLE "plate" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "food_plate";

-- DropTable
DROP TABLE "user_plate";

-- CreateTable
CREATE TABLE "food_user_plate" (
    "plate_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "food_user_plate_plate_id_food_id_key" ON "food_user_plate"("plate_id", "food_id");

-- AddForeignKey
ALTER TABLE "plate" ADD CONSTRAINT "plate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_user_plate" ADD CONSTRAINT "food_user_plate_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_user_plate" ADD CONSTRAINT "food_user_plate_food_id_user_id_fkey" FOREIGN KEY ("food_id", "user_id") REFERENCES "food_user_stock"("food_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
