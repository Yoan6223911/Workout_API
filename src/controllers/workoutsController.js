import {prisma} from "../config/db.js";

// List of workouts
const getWorkouts = async (req, res) => {
    const workouts = await prisma.workout.findMany({
        orderBy: {name: "asc"},
    });

    return res.status(200).json({status: "success", data: {workouts}});
};

// Create a workout
const createWorkout = async (req, res) => {
    const {name} = req.body;

    const existingWorkout = await prisma.workout.findUnique({
        where: {name: name},
    });
    if (existingWorkout) {
        return res.status(409).json({error: "Workout already exists"});
    }

    const workout = await prisma.workout.create({
        data: {name: name},
    });

    return res.status(201).json({status: "success", data: {workout}});
};

// Add an exercice to a workout
const addExercice = async (req, res) => {
    const {exerciceId, sets, repetitions} = req.body;

    const workout = await prisma.workout.findUnique({
        where: {id: req.params.id},
    });
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const exercice = await prisma.exercice.findUnique({
        where: {id: exerciceId},
    });
    if (!exercice) {
        return res.status(404).json({error: "Exercice not found"});
    }

    const existingAssociation = await prisma.workout_Exercices.findUnique({
        where: {
            workoutId_exerciceId: {workoutId: workout.id, exerciceId: exerciceId},
        },
    });
    if (existingAssociation) {
        return res.status(409).json({error: "Exercice already in this workout"});
    }

    const association = await prisma.workout_Exercices.create({
        data: {
            workoutId: workout.id,
            exerciceId: exerciceId,
            sets: sets,
            repetitions: repetitions,
        },
    });

    return res.status(201).json({status: "success", data: {association}});
};

// Remove the association, keeping the exercice itself
const removeExercice = async (req, res) => {
    const {id, exerciceId} = req.params;

    const association = await prisma.workout_Exercices.findUnique({
        where: {
            workoutId_exerciceId: {workoutId: id, exerciceId: exerciceId},
        },
    });
    if (!association) {
        return res.status(404).json({error: "Exercice not found in this workout"});
    }

    await prisma.workout_Exercices.delete({
        where: {id: association.id},
    });

    return res.status(200).json({
        status: "success",
        message: "Exercice removed from workout",
    });
};

// Rename a workout
const editWorkout = async (req, res) => {
    const {name} = req.body;

    const workout = await prisma.workout.findUnique({
        where: {id: req.params.id},
    });
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const editData = {};
    if (name !== undefined) {
        const existingWorkout = await prisma.workout.findUnique({
            where: {name: name},
        });
        if (existingWorkout && existingWorkout.id !== workout.id) {
            return res.status(409).json({error: "Workout already exists"});
        }
        editData.name = name;
    }

    const editedWorkout = await prisma.workout.update({
        where: {id: workout.id},
        data: editData,
    });

    return res.status(200).json({status: "success", data: {workout: editedWorkout}});
};

// Delete a workout; its associations are removed by cascade
const deleteWorkout = async (req, res) => {
    const workout = await prisma.workout.findUnique({
        where: {id: req.params.id},
    });
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    await prisma.workout.delete({where: {id: workout.id}});

    return res.status(200).json({
        status: "success",
        message: "Successfully deleted workout",
    });
};

// Workout details with its exercices, sets and repetitions
const detailsWorkout = async (req, res) => {
    const workout = await prisma.workout.findUnique({
        where: {id: req.params.id},
    });
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const associations = await prisma.workout_Exercices.findMany({
        where: {workoutId: workout.id},
        select: {exercice: true, sets: true, repetitions: true},
        orderBy: {exercice: {name: "asc"}},
    });

    const exercices = associations.map(({exercice, sets, repetitions}) => ({
        ...exercice,
        sets,
        repetitions,
    }));

    return res.status(200).json({
        status: "success",
        data: {workout: {...workout, exercices}},
    });
};

export {getWorkouts, createWorkout, addExercice, removeExercice, editWorkout, deleteWorkout, detailsWorkout};
