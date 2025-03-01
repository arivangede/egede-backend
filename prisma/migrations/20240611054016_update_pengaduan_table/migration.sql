/*
  Warnings:

  - You are about to drop the column `latitude` on the `pengaduan` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_public"."pengaduan" DROP COLUMN "latitude",
DROP COLUMN "longitude";
