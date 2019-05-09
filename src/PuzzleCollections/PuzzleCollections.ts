import { PuzzleJSON, puzzles } from "../Puzzle/Puzzles";

export type PuzzleCollection = PuzzleJSON[];

export const collections: { [key: string]: PuzzleCollection } = {

    tutorials: [
        puzzles.simple_hints
    ],

    animals: [
        puzzles.horse,
        puzzles.platypus
    ],

    furniture: [
        puzzles.chair,
        puzzles.computer
    ],

    egypt: [
        puzzles.pyramid,
        puzzles.sphinx
    ],

    nature: [
        puzzles.strange_tree
    ],

    // collection1: [],
    // collection2: [],
    // collection3: [],
    // collection4: [],
    // collection5: [],
    // collection6: [],
};