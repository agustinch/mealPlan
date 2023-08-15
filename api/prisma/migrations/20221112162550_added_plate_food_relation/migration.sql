-- CreateEnum
CREATE TYPE "PlateType" AS ENUM ('CUSTOM', 'DEFAULT');

-- AlterTable
ALTER TABLE "plate" ADD COLUMN     "type" "PlateType" NOT NULL DEFAULT 'CUSTOM';

-- CreateTable
CREATE TABLE "user_plate" (
    "plate_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_plate_plate_id_user_id_key" ON "user_plate"("plate_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_plate" ADD CONSTRAINT "user_plate_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plate" ADD CONSTRAINT "user_plate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
