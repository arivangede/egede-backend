/*
  Warnings:

  - You are about to drop the column `fk_daerah_id` on the `ikm` table. All the data in the column will be lost.
  - You are about to drop the column `fk_gate_id` on the `ikm` table. All the data in the column will be lost.
  - You are about to drop the column `fk_penduduk_id` on the `ikm` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `layanan_publik` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_surat` on the `layanan_publik` table. All the data in the column will be lost.
  - Added the required column `dusun` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenis_kelamin` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_hp` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pekerjaan` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendidikan_terakhir` to the `ikm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_public"."ikm" DROP CONSTRAINT "ikm_fk_daerah_id_fkey";

-- DropForeignKey
ALTER TABLE "app_public"."ikm" DROP CONSTRAINT "ikm_fk_gate_id_fkey";

-- DropForeignKey
ALTER TABLE "app_public"."ikm" DROP CONSTRAINT "ikm_fk_penduduk_id_fkey";

-- AlterTable
ALTER TABLE "app_public"."ikm" DROP COLUMN "fk_daerah_id",
DROP COLUMN "fk_gate_id",
DROP COLUMN "fk_penduduk_id",
ADD COLUMN     "dusun" TEXT NOT NULL,
ADD COLUMN     "jenis_kelamin" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nik" TEXT NOT NULL,
ADD COLUMN     "no_hp" TEXT NOT NULL,
ADD COLUMN     "pekerjaan" TEXT NOT NULL,
ADD COLUMN     "pendidikan_terakhir" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "app_public"."layanan_publik" DROP COLUMN "keterangan",
DROP COLUMN "nomor_surat",
ADD COLUMN     "deskripsi" TEXT;
