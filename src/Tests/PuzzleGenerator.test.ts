import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { volumes } from "../Utils/Utils";

describe('PuzzleGenerator', () => {

    it('should generate line solvable puzzles', () => {
        const horse = new PicrossPuzzle(volumes.horse());
        expect(horse.isSolvable()).toBe(true);
    });
});