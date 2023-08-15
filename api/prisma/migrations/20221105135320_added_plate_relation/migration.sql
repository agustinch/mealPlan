/*
  Warnings:

  - You are about to drop the column `user_id` on the `plate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plate_id,food_id]` on the table `food_plate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `plate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "plate" DROP CONSTRAINT "plate_user_id_fkey";

-- DropIndex
DROP INDEX "food_plate_food_id_plate_id_key";

-- AlterTable
ALTER TABLE "plate" DROP COLUMN "user_id",
ADD COLUMN     "image" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "food_plate_plate_id_food_id_key" ON "food_plate"("plate_id", "food_id");
