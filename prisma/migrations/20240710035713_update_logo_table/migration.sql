/*
  Warnings:

  - Added the required column `fk_gate_id` to the `ikm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_gate_id` to the `logo_desa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_public"."ikm" ADD COLUMN     "fk_gate_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "app_public"."logo_desa" ADD COLUMN     "fk_gate_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "app_public"."ikm" ADD CONSTRAINT "ikm_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_public"."logo_desa" ADD CONSTRAINT "logo_desa_fk_gate_id_fkey" FOREIGN KEY ("fk_gate_id") REFERENCES "app_public"."gate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
