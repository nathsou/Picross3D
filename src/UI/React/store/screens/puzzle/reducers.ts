import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";
import { PuzzleScreenState, PuzzleScreenActions, TOGGLE_PUZZLE_OPTIONS_MODAL, SET_PUZZLE, DISPOSE_PUZZLE_SCREEN, SET_PUZZLE_START_TIME, SET_PUZZLE_END_TIME } from "./types";

export const defaultPuzzleScreenState: PuzzleScreenState = {
    options_modal_open: false,
    start_time: null,
    end_time: null,
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


function startTimeReducer(
    state = defaultPuzzleScreenState.start_time,
    action: PuzzleScreenActions
): number {
    if (action.type === SET_PUZZLE_START_TIME) {
        return action.time;
    }

    return state;
}

function endTimeReducer(
    state = defaultPuzzleScreenState.end_time,
    action: PuzzleScreenActions
): number {
    if (action.type === SET_PUZZLE_END_TIME) {
        return action.time;
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
        start_time: startTimeReducer(state.start_time, action),
        end_time: endTimeReducer(state.end_time, action),
        puzzle: puzzleReducer(state.puzzle, action)
    };
}