import express from "express";
import {
    getExercices,
    createExercice,
    editExercice,
    removeExercice,
    detailExercice,
} from "../controllers/exercicesController.js";
import {
    createExerciceSchema,
    updateExerciceSchema,
} from "../validators/exerciceValidators.js";
import {validateRequest} from "../middleware/validateRequest.js";

const router = express.Router();

// List all exercices, optionally filtered by ?muscleGroup=CHEST.
router.get("/", getExercices);
router.post("/", validateRequest(createExerciceSchema), createExercice);

// Exercice details include the workouts that use it.
router.get("/:id", detailExercice);
router.patch("/:id", validateRequest(updateExerciceSchema), editExercice);
router.delete("/:id", removeExercice);

export default router;
