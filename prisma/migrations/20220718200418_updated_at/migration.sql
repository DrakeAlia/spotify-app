/*
  Warnings:

  - You are about to drop the column `updatedApp` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedApp` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedApp` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `updatedApp` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "updatedApp",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "updatedApp",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "updatedApp",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedApp",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
