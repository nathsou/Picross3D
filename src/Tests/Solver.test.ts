import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PicrossSolver } from "../Solver/PicrossSolver";
import { volumes } from "../Utils/Utils";
import { state } from "./LineSolver.test";
import { puzzles } from "../Puzzle/Puzzles";


const horse_all_hints = new PicrossPuzzle(volumes.horse());
const horse_few_hints = PicrossPuzzle.fromJSON(puzzles.horse);
let horse_too_few_hints_json = JSON.parse(JSON.stringify(puzzles.horse));
horse_too_few_hints_json.hints[0][0][0].num = 1;
const horse_too_few_hints = PicrossPuzzle.fromJSON(horse_too_few_hints_json);

const solved_horse = state(
    'x_x_' +
    'xxx_' +
    '__x_' +
    '__xx'
);

describe('PicrossSolver', () => {
    it('should solve puzzles using the brute force solver', () => {

        // all hints
        expect([...PicrossSolver.bruteForceSolve(horse_all_hints).getCells().data]).toEqual(solved_horse);

        // missing hints but still line solvable
        expect([...PicrossSolver.bruteForceSolve(horse_few_hints).getCells().data]).toEqual(solved_horse);

        // not enough hints
        expect(PicrossSolver.bruteForceSolve(horse_too_few_hints)).toBeNull();
    });

    it('should solve puzzles using the hierarchical solver', () => {

        // all hints
        expect([...PicrossSolver.hierarchicalSolve(horse_all_hints).getCells().data]).toEqual(solved_horse);

        // missing hints but still line solvable
        expect([...PicrossSolver.hierarchicalSolve(horse_few_hints).getCells().data]).toEqual(solved_horse);

        // not enough hints
        expect(PicrossSolver.hierarchicalSolve(horse_too_few_hints)).toBeNull();
    });

    it('solvers should give the same solution', () => {
        for (const puzzle of Object.values(puzzles)) {
            const p = PicrossPuzzle.fromJSON(puzzle);
            const brute_force = [...PicrossSolver.bruteForceSolve(p).getCells().data];
            const hierarchical = [...PicrossSolver.hierarchicalSolve(p).getCells().data];

            expect(hierarchical).toEqual(brute_force);
            expect(hierarchical).not.toBeNull();
            expect(hierarchical).toBeDefined();
        }
    });
});