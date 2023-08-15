-- CreateTable
CREATE TABLE "meal_schedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "plate_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "meal_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meal_schedule" ADD CONSTRAINT "meal_schedule_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_schedule" ADD CONSTRAINT "meal_schedule_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_schedule" ADD CONSTRAINT "meal_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
