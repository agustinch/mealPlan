-- AlterTable
ALTER TABLE "user" ADD COLUMN     "foodId" INTEGER;

-- CreateTable
CREATE TABLE "_FoodToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToUser_AB_unique" ON "_FoodToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToUser_B_index" ON "_FoodToUser"("B");

-- AddForeignKey
ALTER TABLE "_FoodToUser" ADD CONSTRAINT "_FoodToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToUser" ADD CONSTRAINT "_FoodToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
