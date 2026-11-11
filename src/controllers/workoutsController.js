import workoutRepository from "../repositories/WorkoutRepository.js";
import exerciceRepository from "../repositories/ExerciceRepository.js";

// List of workouts
const getWorkouts = async (req, res) => {
    const workouts = await workoutRepository.findAll();

    return res.status(200).json({status: "success", data: {workouts}});
};

// Create a workout
const createWorkout = async (req, res) => {
    const {name} = req.body;

    const existingWorkout = await workoutRepository.findByName(name);
    if (existingWorkout) {
        return res.status(409).json({error: "Workout already exists"});
    }

    const workout = await workoutRepository.create({name});

    return res.status(201).json({status: "success", data: {workout}});
};

// Add an exercice to a workout
const addExercice = async (req, res) => {
    const {exerciceId, sets, repetitions} = req.body;

    const workout = await workoutRepository.findById(req.params.id);
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const exercice = await exerciceRepository.findById(exerciceId);
    if (!exercice) {
        return res.status(404).json({error: "Exercice not found"});
    }

    const existingAssociation = await workoutRepository.findExercice(workout.id, exerciceId);
    if (existingAssociation) {
        return res.status(409).json({error: "Exercice already in this workout"});
    }

    const association = await workoutRepository.addExercice(workout.id, exerciceId, sets, repetitions);

    return res.status(201).json({status: "success", data: {association}});
};

// Remove the association, keeping the exercice itself
const removeExercice = async (req, res) => {
    const {id, exerciceId} = req.params;

    const association = await workoutRepository.findExercice(id, exerciceId);
    if (!association) {
        return res.status(404).json({error: "Exercice not found in this workout"});
    }

    await workoutRepository.removeExercice(association.id);

    return res.status(200).json({
        status: "success",
        message: "Exercice removed from workout",
    });
};

// Rename a workout
const editWorkout = async (req, res) => {
    const {name} = req.body;

    const workout = await workoutRepository.findById(req.params.id);
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const editData = {};
    if (name !== undefined) {
        const existingWorkout = await workoutRepository.findByName(name);
        if (existingWorkout && existingWorkout.id !== workout.id) {
            return res.status(409).json({error: "Workout already exists"});
        }
        editData.name = name;
    }

    const editedWorkout = await workoutRepository.update(workout.id, editData);

    return res.status(200).json({status: "success", data: {workout: editedWorkout}});
};

// Delete a workout; its associations are removed by cascade
const deleteWorkout = async (req, res) => {
    const workout = await workoutRepository.findById(req.params.id);
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    await workoutRepository.delete(workout.id);

    return res.status(200).json({
        status: "success",
        message: "Successfully deleted workout",
    });
};

// Workout details with its exercices, sets and repetitions
const detailsWorkout = async (req, res) => {
    const workout = await workoutRepository.findById(req.params.id);
    if (!workout) {
        return res.status(404).json({error: "Workout not found"});
    }

    const associations = await workoutRepository.findExercices(workout.id);

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
