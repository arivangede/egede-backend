/*
  Warnings:

  - You are about to drop the column `keuangan` on the `keuangan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_public"."keuangan" DROP COLUMN "keuangan",
ADD COLUMN     "belanja" JSONB[],
ADD COLUMN     "pembiayaan" JSONB[],
ADD COLUMN     "pendapatan" JSONB[],
ADD COLUMN     "status_belanja" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status_pembiayaan" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status_pendapatan" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_status" BOOLEAN NOT NULL DEFAULT true;
