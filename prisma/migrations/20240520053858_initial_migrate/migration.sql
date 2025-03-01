-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app_private";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app_public";

-- CreateTable
CREATE TABLE "app_public"."peran" (
    "id" SERIAL NOT NULL,
    "nama_peran" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_private"."penduduk" (
    "id" TEXT NOT NULL,
    "no_kk" TEXT NOT NULL,
    "kepala_keluarga" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "tempat_lahir" TEXT NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "alamat" TEXT NOT NULL,
    "fk_daerah_id" INTEGER NOT NULL,
    "status_nikah" TEXT NOT NULL,
    "agama" TEXT NOT NULL,
    "suku_bangsa" TEXT NOT NULL,
    "kewarganegaraan" TEXT NOT NULL,
    "pendidikan_terakhir" TEXT NOT NULL,
    "pekerjaan" TEXT NOT NULL,
    "penghasilan" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penduduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_private"."pengguna" (
    "id" TEXT NOT NULL,
    "fk_penduduk_id" TEXT NOT NULL,
    "kata_sandi" TEXT NOT NULL,
    "kode_otp" TEXT,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."pengguna" (
    "id" TEXT NOT NULL,
    "nama_pengguna" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "flag_status" BOOLEAN NOT NULL DEFAULT true,
    "photo" JSONB,
    "fk_peran_id" INTEGER NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."daerah" (
    "id" SERIAL NOT NULL,
    "kota" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "dusun" TEXT NOT NULL,
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daerah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."enews" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "file" JSONB[],
    "fk_gate_id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."gate" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "flag_status" BOOLEAN NOT NULL DEFAULT true,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."likes_enews" (
    "id" SERIAL NOT NULL,
    "fk_enews_id" INTEGER NOT NULL,
    "fk_pengguna_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_enews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."bookmarks_enews" (
    "id" SERIAL NOT NULL,
    "fk_enews_id" INTEGER NOT NULL,
    "fk_pengguna_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_enews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."regulasi" (
    "id" SERIAL NOT NULL,
    "kategori" TEXT NOT NULL,
    "no_regulasi" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "penetapan" DATE NOT NULL,
    "pengundangan" DATE NOT NULL,
    "tentang" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" JSONB,
    "dokumen" JSONB NOT NULL,
    "kode" TEXT NOT NULL,
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."keuangan" (
    "id" SERIAL NOT NULL,
    "tahun" TEXT NOT NULL,
    "keuangan" JSONB NOT NULL,
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keuangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."wisata_budaya" (
    "id" SERIAL NOT NULL,
    "kategori" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "link_gmaps" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "img" JSONB[],
    "fk_gate_id" TEXT NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wisata_budaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."sejarah_desa" (
    "id" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sejarah_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."wilayah_desa" (
    "id" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "tabel" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wilayah_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."visi_misi" (
    "id" TEXT NOT NULL,
    "deskripsi" JSONB NOT NULL,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visi_misi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."struktur_pemerintah_desa" (
    "id" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "data_anggota" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "struktur_pemerintah_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."badan_permusyawaratan_desa" (
    "id" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "data_anggota" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badan_permusyawaratan_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."lembaga_pemberdayaan_masyarakat" (
    "id" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "data_anggota" JSONB[],
    "data_bidang" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lembaga_pemberdayaan_masyarakat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."karang_taruna" (
    "id" TEXT NOT NULL,
    "img" JSONB NOT NULL,
    "data_anggota" JSONB[],
    "data_bidang" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karang_taruna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_public"."iklan" (
    "id" TEXT NOT NULL,
    "contents" JSONB[],
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iklan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_fk_penduduk_id_key" ON "app_private"."pengguna"("fk_penduduk_id");

-- AddForeignKey
ALTER TABLE "app_private"."penduduk" ADD CONSTRAINT "penduduk_fk_daerah_id_fkey" FOREIGN KEY ("fk_daerah_id") REFERENCES "app_public"."daerah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_private"."pengguna" ADD CONSTRAINT "pengguna_fk_penduduk_id_fkey" FOREIGN KEY ("fk_penduduk_id") REFERENCES "app_private"."penduduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."pengguna" ADD CONSTRAINT "pengguna_fk_peran_id_fkey" FOREIGN KEY ("fk_peran_id") REFERENCES "app_public"."peran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."pengguna" ADD CONSTRAINT "pengguna_id_fkey" FOREIGN KEY ("id") REFERENCES "app_private"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."daerah" ADD CONSTRAINT "daerah_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."enews" ADD CONSTRAINT "enews_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."likes_enews" ADD CONSTRAINT "likes_enews_fk_enews_id_fkey" FOREIGN KEY ("fk_enews_id") REFERENCES "app_public"."enews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."likes_enews" ADD CONSTRAINT "likes_enews_fk_pengguna_id_fkey" FOREIGN KEY ("fk_pengguna_id") REFERENCES "app_public"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."bookmarks_enews" ADD CONSTRAINT "bookmarks_enews_fk_enews_id_fkey" FOREIGN KEY ("fk_enews_id") REFERENCES "app_public"."enews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."bookmarks_enews" ADD CONSTRAINT "bookmarks_enews_fk_pengguna_id_fkey" FOREIGN KEY ("fk_pengguna_id") REFERENCES "app_public"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."regulasi" ADD CONSTRAINT "regulasi_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."keuangan" ADD CONSTRAINT "keuangan_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."wisata_budaya" ADD CONSTRAINT "wisata_budaya_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."sejarah_desa" ADD CONSTRAINT "sejarah_desa_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."wilayah_desa" ADD CONSTRAINT "wilayah_desa_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."visi_misi" ADD CONSTRAINT "visi_misi_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."struktur_pemerintah_desa" ADD CONSTRAINT "struktur_pemerintah_desa_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."badan_permusyawaratan_desa" ADD CONSTRAINT "badan_permusyawaratan_desa_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."lembaga_pemberdayaan_masyarakat" ADD CONSTRAINT "lembaga_pemberdayaan_masyarakat_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."karang_taruna" ADD CONSTRAINT "karang_taruna_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."iklan" ADD CONSTRAINT "iklan_id_fkey" FOREIGN KEY ("id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
