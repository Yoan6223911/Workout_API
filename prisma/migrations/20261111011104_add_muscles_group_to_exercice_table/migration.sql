/*
  Warnings:

  - Added the required column `muscleGroup` to the `Exercice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'ABS');

-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "muscleGroup" "MuscleGroup" NOT NULL;
