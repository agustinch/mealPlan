-- CreateEnum
CREATE TYPE "StateType" AS ENUM ('MEAL_SCHEDULE');

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StateType" NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);
