-- AlterTable
ALTER TABLE "app_public"."layanan_publik" ADD COLUMN     "alasan" TEXT;

-- CreateTable
CREATE TABLE "app_public"."perangkat_pengguna" (
    "id" SERIAL NOT NULL,
    "perangkat_id" TEXT NOT NULL,
    "informasi_perangkat" TEXT NOT NULL,
    "pengguna_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perangkat_pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."notifikasi" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL,
    "created_by" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);
