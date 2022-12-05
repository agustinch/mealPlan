-- AlterTable
ALTER TABLE "meal_schedule" ADD COLUMN     "state_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "meal_schedule" ADD CONSTRAINT "meal_schedule_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
