/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,productId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ownerId_productId_key" ON "Stock"("ownerId", "productId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
