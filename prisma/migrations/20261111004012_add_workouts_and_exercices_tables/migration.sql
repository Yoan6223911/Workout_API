-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Exercices" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciceId" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workout_Exercices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workout_Exercices_workoutId_exerciceId_key" ON "Workout_Exercices"("workoutId", "exerciceId");

-- AddForeignKey
ALTER TABLE "Workout_Exercices" ADD CONSTRAINT "Workout_Exercices_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercices" ADD CONSTRAINT "Workout_Exercices_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
