-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_cartId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "orderId" DROP NOT NULL,
ALTER COLUMN "cartId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
