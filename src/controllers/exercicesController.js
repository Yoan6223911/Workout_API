import {prisma} from "../config/db.js";
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

    const exercices = await prisma.exercice.findMany({
        where: muscleGroup === undefined ? {} : {muscleGroup: muscleGroup},
        orderBy: {name: "asc"},
    });

    return res.status(200).json({
        status: "success",
        data: {exercices},
    });
};

// create an exercice
const createExercice = async (req, res) => {
    const {name, muscleGroup} = req.body;

    // verify if the exercice already exists
    const existingExercice = await prisma.exercice.findUnique({
        where: {name: name }
    })
    if (!existingExercice) {
        return res.status(404).json({error: "exercice already exists"});
    }

    const exercice = await prisma.exercice.create({
        data:{
            name: name,
            muscleGroup: muscleGroup
        }
    })

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

    // verify if the exercice already exists
    const existingExercice = await prisma.exercice.findUnique({
        where: {name: name }
    })
    if (!existingExercice) {
        return res.status(404).json({error: "exercice already exists"});
    }

    const editData = {};
    if (name !== undefined) editData.name = name;
    if (muscleGroup !== undefined) editData.muscleGroup = muscleGroup.toUpperCase();

    const editedExercice = await prisma.exercice.update({
        where : {id : req.params.id},
        data: editData
    })

    res.status(200).json({
        status: "success",
        data: {
            editData,
        },
    });
}

// Remove an exercice
const removeExercice = async (req, res) => {
    //Find exercice
    const exercice = await prisma.exercice.findUnique({
        where: {id: req.params.id},
    })

    if (!exercice) {
        return res.status(404).json({error: "exercice not found"});
    }

    await prisma.exercice.delete({
        where: {id:req.params.id},
    })

    res.status(201).json({
        status: "success",
        message: "Successfully deleted exercice",
    })
}

// Détail d'un exercice et des workouts qui l'utilisent
const detailExercice = async (req, res) => {

    const exercice = await prisma.exercice.findUnique({
        where: {id: req.params.id},
    });

    if (!exercice) {
        return res.status(404).json({ error: "exercice not found" });
    }

    const workouts = await prisma.workout.findMany({
        where: {
            workoutExercices: {
                some: {exerciceId: exercice.id},
            },
        },
        orderBy: {name: "asc"},
    });

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
