-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_plate" (
    "plate_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "plate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "plate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_stock_transaction" (
    "id" SERIAL NOT NULL,
    "food_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_stock_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_history" (
    "id" SERIAL NOT NULL,
    "food_id" INTEGER NOT NULL,
    "plate_id" INTEGER NOT NULL,
    "amount" INTEGER,

    CONSTRAINT "meal_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "food_plate_food_id_plate_id_key" ON "food_plate"("food_id", "plate_id");

-- AddForeignKey
ALTER TABLE "food" ADD CONSTRAINT "food_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_plate" ADD CONSTRAINT "food_plate_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_plate" ADD CONSTRAINT "food_plate_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_stock_transaction" ADD CONSTRAINT "food_stock_transaction_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_history" ADD CONSTRAINT "meal_history_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_history" ADD CONSTRAINT "meal_history_plate_id_fkey" FOREIGN KEY ("plate_id") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
