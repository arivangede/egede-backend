/*
  Warnings:

  - You are about to drop the column `kepala_keluarga` on the `penduduk` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `pengguna` table. All the data in the column will be lost.
  - You are about to drop the `wisata_budaya` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_public"."wisata_budaya" DROP CONSTRAINT "wisata_budaya_fk_gate_id_fkey";

-- AlterTable
ALTER TABLE "app_private"."penduduk" DROP COLUMN "kepala_keluarga",
ADD COLUMN     "foto_ijazah" JSONB,
ADD COLUMN     "foto_kk" JSONB,
ADD COLUMN     "foto_ktp" JSONB,
ADD COLUMN     "foto_penduduk" JSONB,
ADD COLUMN     "golongan_darah" TEXT,
ADD COLUMN     "shdk" TEXT;

-- AlterTable
ALTER TABLE "app_public"."pengguna" DROP COLUMN "photo";

-- DropTable
DROP TABLE "app_public"."wisata_budaya";

-- CreateTable
CREATE TABLE "app_public"."kategori_wisata" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."kategori_budaya" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_budaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."konten_wisata" (
    "id" SERIAL NOT NULL,
    "fk_kategori_wisata_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "link_gmaps" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "img" JSONB[],
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "konten_wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."konten_budaya" (
    "id" SERIAL NOT NULL,
    "fk_kategori_budaya_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "link_gmaps" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "img" JSONB[],
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "konten_budaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."kategori_utari" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_utari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."utari" (
    "id" SERIAL NOT NULL,
    "fk_kategori_utari_id" INTEGER NOT NULL,
    "diajukan_oleh_id" TEXT NOT NULL,
    "diterima_oleh_id" TEXT,
    "no_kk" TEXT,
    "nama_lengkap" TEXT,
    "nik" TEXT,
    "jenis_kelamin" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" DATE,
    "alamat" TEXT,
    "status_nikah" TEXT,
    "shdk" TEXT,
    "agama" TEXT,
    "suku_bangsa" TEXT,
    "kewarganegaraan" TEXT,
    "pendidikan_terakhir" TEXT,
    "pekerjaan" TEXT,
    "golongan_darah" TEXT,
    "penghasilan" INTEGER,
    "foto_penduduk" JSONB,
    "foto_ktp" JSONB,
    "foto_kk" JSONB,
    "foto_ijazah" JSONB,
    "status_riwayat" JSONB[],
    "status_riwayat_terbaru" TEXT NOT NULL DEFAULT '',
    "dilihat" BOOLEAN NOT NULL DEFAULT false,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."jenis_layanan_publik" (
    "id" SERIAL NOT NULL,
    "jenis" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_layanan_publik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."kategori_layanan_publik" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "fk_jenis_layanan_id" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_layanan_publik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."sub_kategori_layanan_publik" (
    "id" SERIAL NOT NULL,
    "nama_sub_kategori" TEXT NOT NULL,
    "fk_kategori_id" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_kategori_layanan_publik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."layanan_publik" (
    "id" SERIAL NOT NULL,
    "fk_kategori_layanan_publik_id" INTEGER NOT NULL,
    "diajukan_oleh_id" TEXT NOT NULL,
    "diterima_oleh_id" TEXT,
    "fk_gate_id" TEXT NOT NULL,
    "tanggal_surat" DATE,
    "nomor_surat" TEXT,
    "keterangan" TEXT,
    "foto_ktp" JSONB,
    "foto_kk" JSONB,
    "foto_akta_nikah" JSONB,
    "status_riwayat" JSONB[],
    "status_riwayat_terbaru" TEXT NOT NULL DEFAULT '',
    "status_notifikasi" BOOLEAN NOT NULL DEFAULT false,
    "status_dilihat" BOOLEAN NOT NULL DEFAULT false,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layanan_publik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."dokumen_layanan_publik" (
    "id" SERIAL NOT NULL,
    "dokumen" JSONB,
    "fk_sub_kategori_id" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dokumen_layanan_publik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."ikm" (
    "id" SERIAL NOT NULL,
    "fk_penduduk_id" TEXT NOT NULL,
    "jenis_layanan" TEXT NOT NULL,
    "u1" INTEGER NOT NULL,
    "u2" INTEGER NOT NULL,
    "u3" INTEGER NOT NULL,
    "u4" INTEGER NOT NULL,
    "u5" INTEGER NOT NULL,
    "u6" INTEGER NOT NULL,
    "u7" INTEGER NOT NULL,
    "u8" INTEGER NOT NULL,
    "u9" INTEGER NOT NULL,
    "saran" TEXT NOT NULL,
    "fk_gate_id" TEXT NOT NULL,
    "fk_daerah_id" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ikm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_public"."konten_wisata" ADD CONSTRAINT "konten_wisata_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."konten_wisata" ADD CONSTRAINT "konten_wisata_fk_kategori_wisata_id_fkey" FOREIGN KEY ("fk_kategori_wisata_id") REFERENCES "app_public"."kategori_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."konten_budaya" ADD CONSTRAINT "konten_budaya_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."konten_budaya" ADD CONSTRAINT "konten_budaya_fk_kategori_budaya_id_fkey" FOREIGN KEY ("fk_kategori_budaya_id") REFERENCES "app_public"."kategori_budaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."utari" ADD CONSTRAINT "utari_fk_kategori_utari_id_fkey" FOREIGN KEY ("fk_kategori_utari_id") REFERENCES "app_public"."kategori_utari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."utari" ADD CONSTRAINT "utari_diajukan_oleh_id_fkey" FOREIGN KEY ("diajukan_oleh_id") REFERENCES "app_private"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."utari" ADD CONSTRAINT "utari_diterima_oleh_id_fkey" FOREIGN KEY ("diterima_oleh_id") REFERENCES "app_private"."pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."kategori_layanan_publik" ADD CONSTRAINT "kategori_layanan_publik_fk_jenis_layanan_id_fkey" FOREIGN KEY ("fk_jenis_layanan_id") REFERENCES "app_public"."jenis_layanan_publik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."sub_kategori_layanan_publik" ADD CONSTRAINT "sub_kategori_layanan_publik_fk_kategori_id_fkey" FOREIGN KEY ("fk_kategori_id") REFERENCES "app_public"."kategori_layanan_publik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_fk_kategori_layanan_publik_id_fkey" FOREIGN KEY ("fk_kategori_layanan_publik_id") REFERENCES "app_public"."kategori_layanan_publik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_diajukan_oleh_id_fkey" FOREIGN KEY ("diajukan_oleh_id") REFERENCES "app_private"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_diterima_oleh_id_fkey" FOREIGN KEY ("diterima_oleh_id") REFERENCES "app_private"."pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."layanan_publik" ADD CONSTRAINT "layanan_publik_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."dokumen_layanan_publik" ADD CONSTRAINT "dokumen_layanan_publik_fk_sub_kategori_id_fkey" FOREIGN KEY ("fk_sub_kategori_id") REFERENCES "app_public"."sub_kategori_layanan_publik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."ikm" ADD CONSTRAINT "ikm_fk_penduduk_id_fkey" FOREIGN KEY ("fk_penduduk_id") REFERENCES "app_private"."penduduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."ikm" ADD CONSTRAINT "ikm_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."ikm" ADD CONSTRAINT "ikm_fk_daerah_id_fkey" FOREIGN KEY ("fk_daerah_id") REFERENCES "app_public"."daerah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
