import {prisma} from "../config/db.js";

export class WorkoutRepository {
    constructor(client = prisma) {
        this.client = client;
    }

    findAll() {
        return this.client.workout.findMany({orderBy: {name: "asc"}});
    }

    findById(id) {
        return this.client.workout.findUnique({where: {id}});
    }

    findByName(name) {
        return this.client.workout.findUnique({where: {name}});
    }

    findByExerciceId(exerciceId) {
        return this.client.workout.findMany({
            where: {workoutExercices: {some: {exerciceId}}},
            orderBy: {name: "asc"},
        });
    }

    create(data) {
        return this.client.workout.create({data});
    }

    update(id, data) {
        return this.client.workout.update({where: {id}, data});
    }

    delete(id) {
        return this.client.workout.delete({where: {id}});
    }

    findExercice(workoutId, exerciceId) {
        return this.client.workout_Exercices.findUnique({
            where: {workoutId_exerciceId: {workoutId, exerciceId}},
        });
    }

    addExercice(workoutId, exerciceId, sets, repetitions) {
        return this.client.workout_Exercices.create({
            data: {workoutId, exerciceId, sets, repetitions},
        });
    }

    removeExercice(associationId) {
        return this.client.workout_Exercices.delete({where: {id: associationId}});
    }

    findExercices(workoutId) {
        return this.client.workout_Exercices.findMany({
            where: {workoutId},
            select: {exercice: true, sets: true, repetitions: true},
            orderBy: {exercice: {name: "asc"}},
        });
    }

    upsert({id, name}) {
        return this.client.workout.upsert({
            where: {id}, update: {name}, create: {id, name},
        });
    }

    upsertExercice(workoutId, exerciceId, sets, repetitions) {
        return this.client.workout_Exercices.upsert({
            where: {workoutId_exerciceId: {workoutId, exerciceId}},
            update: {sets, repetitions},
            create: {workoutId, exerciceId, sets, repetitions},
        });
    }
}

export default new WorkoutRepository();
