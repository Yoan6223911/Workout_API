import {prisma} from "../config/db.js";
import {ExerciceRepository} from "./ExerciceRepository.js";
import {WorkoutRepository} from "./WorkoutRepository.js";

export class SeedRepository {
    constructor(client = prisma) {
        this.client = client;
        this.exercices = new ExerciceRepository(client);
        this.workouts = new WorkoutRepository(client);
    }

    // Keep the seed atomic and repeatable.
    seed(exercices, workouts) {
        const operations = exercices.map((exercice) => this.exercices.upsert(exercice));

        for (const {id, name, exercices: workoutExercices} of workouts) {
            operations.push(this.workouts.upsert({id, name}));
            for (const {exerciceId, sets, repetitions} of workoutExercices) {
                operations.push(this.workouts.upsertExercice(id, exerciceId, sets, repetitions));
            }
        }

        return this.client.$transaction(operations);
    }
}

export default new SeedRepository();
