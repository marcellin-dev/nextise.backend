-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_id_key" ON "Otp"("id");
