import seedRepository from "../../src/repositories/SeedRepository.js";
import {disconnectDB} from "../../src/config/db.js";

// Identifiants stables pour pouvoir relancer le seed sans doublons.
const exercices = [
    { id: "seed-exercice-01", name: "Squat", muscleGroup: "LEGS" },
    { id: "seed-exercice-02", name: "Fentes avant", muscleGroup: "LEGS" },
    { id: "seed-exercice-03", name: "Presse à cuisses", muscleGroup: "LEGS" },
    { id: "seed-exercice-04", name: "Développé couché", muscleGroup: "CHEST" },
    { id: "seed-exercice-05", name: "Pompes", muscleGroup: "CHEST" },
    { id: "seed-exercice-06", name: "Écarté avec haltères", muscleGroup: "CHEST" },
    { id: "seed-exercice-07", name: "Tractions", muscleGroup: "BACK" },
    { id: "seed-exercice-08", name: "Rowing avec haltères", muscleGroup: "BACK" },
    { id: "seed-exercice-09", name: "Tirage vertical", muscleGroup: "BACK" },
    { id: "seed-exercice-10", name: "Développé militaire", muscleGroup: "SHOULDERS" },
    { id: "seed-exercice-11", name: "Élévations latérales", muscleGroup: "SHOULDERS" },
    { id: "seed-exercice-12", name: "Curl biceps", muscleGroup: "BICEPS" },
    { id: "seed-exercice-13", name: "Extension triceps à la poulie", muscleGroup: "TRICEPS" },
    { id: "seed-exercice-14", name: "Crunch abdominal", muscleGroup: "ABS" },
    { id: "seed-exercice-15", name: "Relevé de jambes", muscleGroup: "ABS" },
];

const workouts = [
    {
        id: "seed-workout-01",
        name: "Jambes",
        exercices: [
            { exerciceId: "seed-exercice-01", sets: 4, repetitions: 10 },
            { exerciceId: "seed-exercice-02", sets: 3, repetitions: 12 },
            { exerciceId: "seed-exercice-03", sets: 3, repetitions: 12 },
        ],
    },
    {
        id: "seed-workout-02",
        name: "Pectoraux",
        exercices: [
            { exerciceId: "seed-exercice-04", sets: 4, repetitions: 8 },
            { exerciceId: "seed-exercice-05", sets: 3, repetitions: 15 },
            { exerciceId: "seed-exercice-06", sets: 3, repetitions: 12 },
        ],
    },
    {
        id: "seed-workout-03",
        name: "Dos",
        exercices: [
            { exerciceId: "seed-exercice-07", sets: 4, repetitions: 8 },
            { exerciceId: "seed-exercice-08", sets: 3, repetitions: 10 },
            { exerciceId: "seed-exercice-09", sets: 3, repetitions: 12 },
        ],
    },
    {
        id: "seed-workout-04",
        name: "Épaules et bras",
        exercices: [
            { exerciceId: "seed-exercice-10", sets: 4, repetitions: 8 },
            { exerciceId: "seed-exercice-11", sets: 3, repetitions: 15 },
            { exerciceId: "seed-exercice-12", sets: 3, repetitions: 12 },
            { exerciceId: "seed-exercice-13", sets: 3, repetitions: 12 },
        ],
    },
    {
        id: "seed-workout-05",
        name: "Full body et abdominaux",
        exercices: [
            { exerciceId: "seed-exercice-01", sets: 3, repetitions: 10 },
            { exerciceId: "seed-exercice-05", sets: 3, repetitions: 12 },
            { exerciceId: "seed-exercice-08", sets: 3, repetitions: 10 },
            { exerciceId: "seed-exercice-14", sets: 3, repetitions: 20 },
            { exerciceId: "seed-exercice-15", sets: 3, repetitions: 15 },
        ],
    },
];

const main = async () => {
    await seedRepository.seed(exercices, workouts);
    console.log("Seed finished : 15 exercices, 5 workouts with their association.");
};

main()
    .catch((err) => {
        console.error("Seed failed  :", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await disconnectDB();
    });

