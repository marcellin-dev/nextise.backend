-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "notes" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "trainer_price" DOUBLE PRECISION NOT NULL,
    "trainer_id" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "training_subjects" TEXT[],
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_email_key" ON "trainers"("email");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
