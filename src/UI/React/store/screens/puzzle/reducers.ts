import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";
import { PuzzleScreenState, PuzzleScreenActions, TOGGLE_PUZZLE_OPTIONS_MODAL, SET_PUZZLE, DISPOSE_PUZZLE_SCREEN } from "./types";

export const defaultPuzzleScreenState: PuzzleScreenState = {
    options_modal_open: false,
    puzzle: null
};

function toggleModalReducer(
    state = defaultPuzzleScreenState.options_modal_open,
    action: PuzzleScreenActions
): boolean {

    if (action.type === TOGGLE_PUZZLE_OPTIONS_MODAL) {
        return !state;
    }

    return state;
}

function puzzleReducer(
    state = defaultPuzzleScreenState.puzzle,
    action: PuzzleScreenActions
): PuzzleJSON {
    if (action.type === SET_PUZZLE) {
        return action.puzzle;
    }

    return state;
}

export function puzzleScreenReducer(
    state = defaultPuzzleScreenState,
    action: PuzzleScreenActions
): PuzzleScreenState {

    if (action.type === DISPOSE_PUZZLE_SCREEN) {
        return defaultPuzzleScreenState;
    }

    return {
        options_modal_open: toggleModalReducer(state.options_modal_open, action),
        puzzle: puzzleReducer(state.puzzle, action)
    };
}