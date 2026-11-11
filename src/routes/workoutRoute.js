import express from "express";
import {
    getWorkouts,
    createWorkout,
    addExercice,
    removeExercice,
    editWorkout,
    deleteWorkout,
    detailsWorkout,
} from "../controllers/workoutsController.js";
import {
    createWorkoutSchema,
    updateWorkoutSchema,
    addExerciceSchema,
} from "../validators/workoutValidators.js";
import {validateRequest} from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getWorkouts);
router.post("/", validateRequest(createWorkoutSchema), createWorkout);

// Workout details include its exercices, sets and repetitions.
router.get("/:id", detailsWorkout);
router.patch("/:id", validateRequest(updateWorkoutSchema), editWorkout);
router.delete("/:id", deleteWorkout);

// Add or remove an association without deleting the exercice itself.
router.post("/:id/exercices", validateRequest(addExerciceSchema), addExercice);
router.delete("/:id/exercices/:exerciceId", removeExercice);

export default router;
