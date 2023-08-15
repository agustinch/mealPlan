/*
  Warnings:

  - You are about to drop the column `unit_id` on the `food` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "food" DROP CONSTRAINT "food_unit_id_fkey";

-- AlterTable
ALTER TABLE "food" DROP COLUMN "unit_id";

-- CreateTable
CREATE TABLE "food_unit" (
    "unit_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "food_unit_unit_id_food_id_user_id_key" ON "food_unit"("unit_id", "food_id", "user_id");

-- AddForeignKey
ALTER TABLE "food_unit" ADD CONSTRAINT "food_unit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_unit" ADD CONSTRAINT "food_unit_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_unit" ADD CONSTRAINT "food_unit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
