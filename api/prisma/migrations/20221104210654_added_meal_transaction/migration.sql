/*
  Warnings:

  - You are about to drop the `food_stock_transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "food_stock_transaction" DROP CONSTRAINT "food_stock_transaction_food_id_fkey";

-- DropForeignKey
ALTER TABLE "meal_history" DROP CONSTRAINT "meal_history_food_id_fkey";

-- DropForeignKey
ALTER TABLE "meal_history" DROP CONSTRAINT "meal_history_plate_id_fkey";

-- DropTable
DROP TABLE "food_stock_transaction";

-- DropTable
DROP TABLE "meal_history";

-- CreateTable
CREATE TABLE "meal_transaction" (
    "id" SERIAL NOT NULL,
    "food_id" INTEGER NOT NULL,
    "plate_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plateId" INTEGER NOT NULL,

    CONSTRAINT "meal_transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meal_transaction" ADD CONSTRAINT "meal_transaction_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_transaction" ADD CONSTRAINT "meal_transaction_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
