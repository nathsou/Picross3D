import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export interface PuzzleScreenState {
    puzzle: PuzzleJSON,
    options_modal_open: boolean,
    // finish_modal_open: boolean,
    start_time: number,
    end_time: number
}

export const TOGGLE_PUZZLE_OPTIONS_MODAL = 'TOGGLE_PUZZLE_OPTIONS_MODAL';
export const SET_PUZZLE = 'SET_PUZZLE';
export const DISPOSE_PUZZLE_SCREEN = 'DISPOSE_PUZZLE_SCREEN';
export const SET_PUZZLE_START_TIME = 'SET_PUZZLE_START_TIME';
export const SET_PUZZLE_END_TIME = 'SET_PUZZLE_END_TIME';

export interface TogglePuzzleOptionsModalAction {
    type: typeof TOGGLE_PUZZLE_OPTIONS_MODAL
}

export interface setPuzzleAction {
    type: typeof SET_PUZZLE,
    puzzle: PuzzleJSON
}

export interface setPuzzleStartTimeAction {
    type: typeof SET_PUZZLE_START_TIME,
    time: number
}

export interface setPuzzleEndTimeAction {
    type: typeof SET_PUZZLE_END_TIME,
    time: number
}

export interface disposePuzzleScreenAction {
    type: typeof DISPOSE_PUZZLE_SCREEN
}

export type PuzzleScreenActions =
    TogglePuzzleOptionsModalAction |
    setPuzzleAction |
    disposePuzzleScreenAction |
    setPuzzleStartTimeAction |
    setPuzzleEndTimeAction;