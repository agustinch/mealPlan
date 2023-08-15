/*
  Warnings:

  - You are about to drop the column `plateId` on the `meal_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_FoodToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `food_plate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `meal_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `plate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FoodToUser" DROP CONSTRAINT "_FoodToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToUser" DROP CONSTRAINT "_FoodToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "meal_transaction" DROP CONSTRAINT "meal_transaction_plateId_fkey";

-- AlterTable
ALTER TABLE "food_plate" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "meal_transaction" DROP COLUMN "plateId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "plate" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "foodId";

-- DropTable
DROP TABLE "_FoodToUser";

-- CreateTable
CREATE TABLE "food_user_stock" (
    "food_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "food_user_stock_food_id_user_id_key" ON "food_user_stock"("food_id", "user_id");

-- AddForeignKey
ALTER TABLE "plate" ADD CONSTRAINT "plate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_transaction" ADD CONSTRAINT "meal_transaction_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_transaction" ADD CONSTRAINT "meal_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_user_stock" ADD CONSTRAINT "food_user_stock_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_user_stock" ADD CONSTRAINT "food_user_stock_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
