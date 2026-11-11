/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Exercice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exercice_name_key" ON "Exercice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_name_key" ON "Workout"("name");
