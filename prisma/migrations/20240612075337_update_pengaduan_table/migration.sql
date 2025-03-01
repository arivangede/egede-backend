/*
  Warnings:

  - You are about to drop the column `validation_status` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_public"."pengaduan" DROP COLUMN "validation_status",
ADD COLUMN     "isVerificated" BOOLEAN NOT NULL DEFAULT false;
