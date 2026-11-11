import {z} from "zod";
import {MuscleGroup} from "@prisma/client";

const nameSchema = z.string({error: "Exercice name must be a string"})
    .trim()
    .min(1, "Exercice name is required");

const muscleGroupSchema = z.string({error: "Muscle group must be a string"})
    .trim()
    .toUpperCase()
    .pipe(z.enum(MuscleGroup, {
        error: `Muscle group must be one of: ${Object.values(MuscleGroup).join(", ")}`,
    }));

// Both fields are required when creating an exercice.
const createExerciceSchema = z.object({
    name: nameSchema,
    muscleGroup: muscleGroupSchema,
}).strict();

// Either field can be updated, but the request must contain at least one.
const updateExerciceSchema = z.object({
    name: nameSchema.optional(),
    muscleGroup: muscleGroupSchema.optional(),
}).strict().refine(
    ({name, muscleGroup}) => name !== undefined || muscleGroup !== undefined,
    {message: "Provide at least one field to update: name or muscleGroup"}
);

export {createExerciceSchema, updateExerciceSchema};
