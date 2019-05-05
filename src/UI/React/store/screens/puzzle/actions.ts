import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";
import { TogglePuzzleOptionsModalAction, TOGGLE_PUZZLE_OPTIONS_MODAL, SET_PUZZLE, setPuzzleAction, disposePuzzleScreenAction, DISPOSE_PUZZLE_SCREEN } from "./types";

export function togglePuzzleOptionsModal(): TogglePuzzleOptionsModalAction {
    return {
        type: TOGGLE_PUZZLE_OPTIONS_MODAL
    };
}

export function setPuzzle(puzzle: PuzzleJSON): setPuzzleAction {
    return {
        type: SET_PUZZLE,
        puzzle
    };
}

export function disposePuzzleScreen(): disposePuzzleScreenAction {
    return {
        type: DISPOSE_PUZZLE_SCREEN
    };
}