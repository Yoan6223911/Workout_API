import {z} from "zod";

const nameSchema = z.string({error: "Workout name must be a string"})
    .trim()
    .min(1, "Workout name is required");

// A name is required when creating a workout.
const createWorkoutSchema = z.object({
    name: nameSchema,
}).strict();

// Renaming is the only change handled by editWorkout.
const updateWorkoutSchema = z.object({
    name: nameSchema,
}).strict();

// Validate the body used to add an existing exercice to a workout.
// IDs are strings, allowing both generated UUIDs and the fixed seed IDs.
const addExerciceSchema = z.object({
    exerciceId: z.string({error: "Exercice ID must be a string"})
        .trim()
        .min(1, "Exercice ID is required"),
    sets: z.number({error: "Sets must be a number"})
        .int("Sets must be an integer")
        .positive("Sets must be greater than zero")
        .max(100, "Sets exceed the supported limit"),
    repetitions: z.number({error: "Repetitions must be a number"})
        .int("Repetitions must be an integer")
        .positive("Repetitions must be greater than zero")
        .max(100, "Repetitions exceed the supported limit"),
}).strict();

export {createWorkoutSchema, updateWorkoutSchema, addExerciceSchema};
