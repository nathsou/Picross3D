import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PicrossSolver } from "../Solver/PicrossSolver";
import { volumes } from "../Utils/Utils";
import { state } from "./LineSolver.test";


const horse_json = '{ "name": "Horse", "dims": [4, 4, 1], "hints": [[[{ "num": 2, "type": 1 }], [{ "num": 3, "type": 0 }], [{ "num": 1, "type": 0 }], [{ "num": 2, "type": 0 }]], [[{ "num": 2, "type": 0 }], [{ "num": 1, "type": 0 }], [null], [{ "num": 1, "type": 0 }]], [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]] }';
let horse_too_few_hints_json = JSON.parse(horse_json);
horse_too_few_hints_json.hints[0][0][0].num = 1;
// const horse_too_few_hints = PicrossPuzzle.fromJSON(horse_too_few_hints_json);

const solved_horse = state(
    'x_x_' +
    'xxx_' +
    '__x_' +
    '__xx'
);

describe('PicrossSolver', () => {
    it('should solve puzzles using brute force', () => {

        // all hints
        expect([...PicrossSolver.bruteForceSolve(new PicrossPuzzle(volumes.horse())).getCells().data]).toEqual(solved_horse);

        // missing hints but still line solvable
        expect([...PicrossSolver.bruteForceSolve(PicrossPuzzle.fromJSON(horse_json)).getCells().data]).toEqual(solved_horse);

        // not enough hints
        expect(PicrossSolver.bruteForceSolve(PicrossPuzzle.fromJSON(horse_too_few_hints_json))).toBeNull();
    });

    it('should solve puzzles using the hierarchical solver', () => {

        // all hints
        expect([...PicrossSolver.hierarchicalSolve(new PicrossPuzzle(volumes.horse())).getCells().data]).toEqual(solved_horse);

        // missing hints but still line solvable
        expect([...PicrossSolver.hierarchicalSolve(PicrossPuzzle.fromJSON(horse_json)).getCells().data]).toEqual(solved_horse);

        // not enough hints
        expect(PicrossSolver.hierarchicalSolve(PicrossPuzzle.fromJSON(horse_too_few_hints_json))).toBeNull();
    });
});