/*
  Warnings:

  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf";
