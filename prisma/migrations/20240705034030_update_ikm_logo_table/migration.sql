/*
  Warnings:

  - You are about to drop the column `status_dilihat` on the `layanan_publik` table. All the data in the column will be lost.
  - You are about to drop the column `status_notifikasi` on the `layanan_publik` table. All the data in the column will be lost.
  - Added the required column `fk_daerah_id` to the `layanan_publik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_penduduk_id` to the `layanan_publik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_public"."layanan_publik" DROP COLUMN "status_dilihat",
DROP COLUMN "status_notifikasi",
ADD COLUMN     "fk_daerah_id" INTEGER NOT NULL,
ADD COLUMN     "fk_penduduk_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "app_public"."logo_desa" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "logo" JSONB NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logo_desa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_fk_penduduk_id_fkey" FOREIGN KEY ("fk_penduduk_id") REFERENCES "app_private"."penduduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_fk_daerah_id_fkey" FOREIGN KEY ("fk_daerah_id") REFERENCES "app_public"."daerah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
