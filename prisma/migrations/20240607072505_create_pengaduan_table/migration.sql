-- CreateTable
CREATE TABLE "app_public"."pengaduan" (
    "id" TEXT NOT NULL,
    "fk_pengguna_id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "file" JSONB NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "lokasi" JSONB NOT NULL,
    "status" JSONB[],
    "fk_daerah_id" INTEGER NOT NULL,
    "fk_gate_id" TEXT NOT NULL,
    "validation_status" BOOLEAN NOT NULL DEFAULT false,
    "cts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaduan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app_public"."pengaduan" ADD CONSTRAINT "pengaduan_fk_pengguna_id_fkey" FOREIGN KEY ("fk_pengguna_id") REFERENCES "app_public"."pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."pengaduan" ADD CONSTRAINT "pengaduan_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."pengaduan" ADD CONSTRAINT "pengaduan_fk_daerah_id_fkey" FOREIGN KEY ("fk_daerah_id") REFERENCES "app_public"."daerah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
