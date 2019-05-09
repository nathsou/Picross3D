import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";
import { TogglePuzzleOptionsModalAction, TOGGLE_PUZZLE_OPTIONS_MODAL, SET_PUZZLE, setPuzzleAction, disposePuzzleScreenAction, DISPOSE_PUZZLE_SCREEN, setPuzzleStartTimeAction, SET_PUZZLE_START_TIME, setPuzzleEndTimeAction, SET_PUZZLE_END_TIME } from "./types";

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

export function setPuzzleStartTime(): setPuzzleStartTimeAction {
    return {
        type: SET_PUZZLE_START_TIME,
        time: Date.now()
    };
}

export function setPuzzleEndTime(): setPuzzleEndTimeAction {
    return {
        type: SET_PUZZLE_END_TIME,
        time: Date.now()
    };
}

export function disposePuzzleScreen(): disposePuzzleScreenAction {
    return {
        type: DISPOSE_PUZZLE_SCREEN
    };
}