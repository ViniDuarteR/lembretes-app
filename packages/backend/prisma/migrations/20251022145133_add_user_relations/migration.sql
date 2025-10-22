/*
  Warnings:

  - Added the required column `userId` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Medicamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consulta" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Medicamento" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamento" ADD CONSTRAINT "Medicamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
