/*
  Warnings:

  - You are about to drop the column `status` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_public"."pengaduan" DROP COLUMN "status",
ADD COLUMN     "status_riwayat" JSONB[],
ADD COLUMN     "status_riwayat_terbaru" TEXT DEFAULT '';
