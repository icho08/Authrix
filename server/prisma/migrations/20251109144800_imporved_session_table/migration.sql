/*
  Warnings:

  - You are about to drop the column `deviceInfo` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "deviceInfo",
ADD COLUMN     "browser" TEXT,
ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "os" TEXT;
