import exerciceRepository from "../repositories/ExerciceRepository.js";
import workoutRepository from "../repositories/WorkoutRepository.js";
import {MuscleGroup} from "@prisma/client";

// list exerices with a group musculation filter
const getExercices = async (req, res) => {
    let {muscleGroup} = req.query;

    if (muscleGroup !== undefined) {
        if (typeof muscleGroup !== "string") {
            return res.status(400).json({error: "Invalid muscle group"});
        }

        muscleGroup = muscleGroup.trim().toUpperCase();
        if (!Object.values(MuscleGroup).includes(muscleGroup)) {
            return res.status(400).json({error: "Invalid muscle group"});
        }

    }

    const exercices = await exerciceRepository.findAll(muscleGroup);

    return res.status(200).json({
        status: "success",
        data: {exercices},
    });
};

// create an exercice
const createExercice = async (req, res) => {
    const {name, muscleGroup} = req.body;

    // verify if the exercice already exists
    const existingExercice = await exerciceRepository.findByName(name);
    if (existingExercice) {
        return res.status(409).json({error: "exercice already exists"});
    }

    const exercice = await exerciceRepository.create({name, muscleGroup})

    res.status(201).json({
        status: "success",
        data: {
            exercice,
        },
    })
}

// edit an exercice
const editExercice = async (req, res) => {
    const {name, muscleGroup} = req.body;

    const exercice = await exerciceRepository.findById(req.params.id);
    if (!exercice) {
        return res.status(404).json({error: "exercice not found"});
    }

    if (name !== undefined) {
        const existingExercice = await exerciceRepository.findByName(name);
        if (existingExercice && existingExercice.id !== exercice.id) {
            return res.status(409).json({error: "exercice already exists"});
        }
    }

    const editData = {};
    if (name !== undefined) editData.name = name;
    if (muscleGroup !== undefined) editData.muscleGroup = muscleGroup.toUpperCase();

    const editedExercice = await exerciceRepository.update(req.params.id, editData)

    res.status(200).json({
        status: "success",
        data: {
            exercice: editedExercice,
        },
    });
}

// Remove an exercice
const removeExercice = async (req, res) => {
    //Find exercice
    const exercice = await exerciceRepository.findById(req.params.id)

    if (!exercice) {
        return res.status(404).json({error: "exercice not found"});
    }

    await exerciceRepository.delete(req.params.id)

    res.status(201).json({
        status: "success",
        message: "Successfully deleted exercice",
    })
}

// Détail d'un exercice et des workouts qui l'utilisent
const detailExercice = async (req, res) => {

    const exercice = await exerciceRepository.findById(req.params.id);

    if (!exercice) {
        return res.status(404).json({ error: "exercice not found" });
    }

    const workouts = await workoutRepository.findByExerciceId(exercice.id);

    return res.status(200).json({
        status: "success",
        data: {
            exercice: {
                ...exercice,
                workouts,
            },
        },
    });
};

export {getExercices, createExercice, editExercice, removeExercice, detailExercice};
