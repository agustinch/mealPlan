-- CreateTable
CREATE TABLE "black_list_token" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "black_list_token_pkey" PRIMARY KEY ("id")
);
