import {prisma} from "../config/db.js";

export class ExerciceRepository {
    constructor(client = prisma) {
        this.client = client;
    }

    findAll(muscleGroup) {
        return this.client.exercice.findMany({
            where: muscleGroup === undefined ? {} : {muscleGroup: muscleGroup},
            orderBy: {name: "asc"},
        });
    }

    findById(id) {
        return this.client.exercice.findUnique({where: {id}});
    }

    findByName(name) {
        return this.client.exercice.findUnique({where: {name}});
    }

    create(data) {
        return this.client.exercice.create({data});
    }

    update(id, data) {
        return this.client.exercice.update({where: {id}, data});
    }

    delete(id) {
        return this.client.exercice.delete({where: {id}});
    }

    upsert({id, name, muscleGroup}) {
        return this.client.exercice.upsert({
            where: {id},
            update: {name, muscleGroup},
            create: {id, name, muscleGroup},
        });
    }
}

export default new ExerciceRepository();
