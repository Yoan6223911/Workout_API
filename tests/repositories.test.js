import assert from "node:assert/strict";
import {test} from "node:test";
import {ExerciceRepository} from "../src/repositories/ExerciceRepository.js";
import {WorkoutRepository} from "../src/repositories/WorkoutRepository.js";
import {SeedRepository} from "../src/repositories/SeedRepository.js";
import exerciceRepository from "../src/repositories/ExerciceRepository.js";
import workoutRepository from "../src/repositories/WorkoutRepository.js";
import {createExercice, editExercice} from "../src/controllers/exercicesController.js";
import {detailsWorkout, removeExercice} from "../src/controllers/workoutsController.js";

const response = () => ({
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
});

test("exercise repository filters by muscle group, with an unfiltered default", async () => {
    const calls = [];
    const repository = new ExerciceRepository({exercice: {
        findMany: async (query) => {calls.push(query); return [];},
    }});
    await repository.findAll();
    await repository.findAll("LEGS");
    assert.deepEqual(calls.map(({where}) => where), [{}, {muscleGroup: "LEGS"}]);
});

test("removing an exercise deletes only its association", async (t) => {
    const deleted = [];
    const repository = new WorkoutRepository({workout_Exercices: {
        delete: async (query) => {deleted.push(query);},
    }});
    t.mock.method(workoutRepository, "findExercice", async () => ({id: "association-1"}));
    t.mock.method(workoutRepository, "removeExercice", repository.removeExercice.bind(repository));
    const res = response();
    await removeExercice({params: {id: "w1", exerciceId: "e1"}}, res);
    assert.equal(res.code, 200);
    assert.deepEqual(deleted, [{where: {id: "association-1"}}]);
});

test("exercise creation succeeds for a new name and rejects a duplicate", async (t) => {
    const existing = t.mock.method(exerciceRepository, "findByName", async () => null);
    const create = t.mock.method(exerciceRepository, "create", async (data) => ({id: "e1", ...data}));
    const req = {body: {name: "Squat", muscleGroup: "LEGS"}};
    const res = response();
    await createExercice(req, res);
    assert.equal(res.code, 201);
    existing.mock.mockImplementation(async () => ({id: "e1"}));
    const duplicate = response();
    await createExercice(req, duplicate);
    assert.equal(duplicate.code, 409);
    assert.equal(create.mock.callCount(), 1);
});

test("exercise update accepts muscle group alone and returns the saved exercise", async (t) => {
    t.mock.method(exerciceRepository, "findById", async () => ({id: "e1"}));
    const nameLookup = t.mock.method(exerciceRepository, "findByName", () => assert.fail("No name to check"));
    t.mock.method(exerciceRepository, "update", async (id, data) => ({id, ...data}));
    const res = response();
    await editExercice({params: {id: "e1"}, body: {muscleGroup: "BACK"}}, res);
    assert.equal(res.code, 200);
    assert.deepEqual(res.body.data.exercice, {id: "e1", muscleGroup: "BACK"});
    assert.equal(nameLookup.mock.callCount(), 0);
});

test("workout detail keeps sets and repetitions in its response", async (t) => {
    t.mock.method(workoutRepository, "findById", async () => ({id: "w1", name: "Jambes"}));
    t.mock.method(workoutRepository, "findExercices", async () => [
        {exercice: {id: "e1", name: "Squat"}, sets: 3, repetitions: 12},
    ]);
    const res = response();
    await detailsWorkout({params: {id: "w1"}}, res);
    assert.deepEqual(res.body.data.workout.exercices, [
        {id: "e1", name: "Squat", sets: 3, repetitions: 12},
    ]);
});

test("seed submits exercises, workouts and associations in one transaction", async () => {
    const operations = [];
    const upsert = (query) => {const operation = {query}; operations.push(operation); return operation;};
    let transactions = 0;
    const repository = new SeedRepository({
        exercice: {upsert}, workout: {upsert}, workout_Exercices: {upsert},
        $transaction: async (queries) => {
            transactions++;
            assert.deepEqual(queries, operations);
        },
    });
    await repository.seed([{id: "e1", name: "Squat", muscleGroup: "LEGS"}], [
        {id: "w1", name: "Jambes", exercices: [{exerciceId: "e1", sets: 3, repetitions: 12}]},
    ]);
    assert.equal(transactions, 1);
    assert.equal(operations.length, 3);
    assert.deepEqual(operations[2].query.create, {workoutId: "w1", exerciceId: "e1", sets: 3, repetitions: 12});
});
