/*
  Warnings:

  - You are about to drop the column `alasan` on the `layanan_publik` table. All the data in the column will be lost.
  - You are about to drop the `notifikasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perangkat_pengguna` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "app_public"."layanan_publik" DROP COLUMN "alasan";

-- AlterTable
ALTER TABLE "app_public"."utari" ADD COLUMN     "comment" TEXT;

-- DropTable
DROP TABLE "app_public"."notifikasi";

-- DropTable
DROP TABLE "app_public"."perangkat_pengguna";
